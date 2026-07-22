/**
 * @module @application/persistence/companyBrainSnapshotMapper
 *
 * Maps company brain aggregates to and from V3 savegame snapshots.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { ActiveStrategy } from '../../domain/brain/ActiveStrategy.js';
import { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import { createCompanyBrainId } from '../../domain/brain/CompanyBrainId.js';
import { CompanyDecision } from '../../domain/brain/CompanyDecision.js';
import type { CompanyDecisionPayload } from '../../domain/brain/CompanyDecisionPayload.js';
import { createCompanyDecisionId } from '../../domain/brain/CompanyDecisionId.js';
import type { CompanyDecisionStatus } from '../../domain/brain/CompanyDecisionStatus.js';
import type { CompanyDecisionType } from '../../domain/brain/CompanyDecisionType.js';
import type { CompanyBrainRepository } from '../../domain/brain/CompanyBrainRepository.js';
import { Goal } from '../../domain/brain/Goal.js';
import { createGoalId } from '../../domain/brain/GoalId.js';
import type { GoalKind } from '../../domain/brain/GoalKind.js';
import type { GoalStatus } from '../../domain/brain/GoalStatus.js';
import { KnowledgeEntry } from '../../domain/brain/KnowledgeEntry.js';
import { createKnowledgeEntryId } from '../../domain/brain/KnowledgeEntryId.js';
import type { KnowledgeKind } from '../../domain/brain/KnowledgeKind.js';
import type { KnowledgeValue } from '../../domain/brain/KnowledgeValue.js';
import { MemoryEntry } from '../../domain/brain/MemoryEntry.js';
import { createMemoryEntryId } from '../../domain/brain/MemoryEntryId.js';
import type { MemoryKind } from '../../domain/brain/MemoryKind.js';
import type { PlanningLayer } from '../../domain/brain/PlanningLayer.js';
import type {
  GameSaveCompanyBrainSnapshotV3,
  GameSaveCompanyDecisionPayloadSnapshotV3,
  GameSaveCompanyDecisionSnapshotV3,
  GameSaveGoalSnapshotV3,
  GameSaveKnowledgeSnapshotV3,
  GameSaveMemorySnapshotV3,
} from './GameSaveSnapshotV3.js';
import { orderMemoryPayload } from './orderGameSaveSnapshotV3.js';

/** Serializes all company brains from the repository. */
export function serializeCompanyBrains(
  companyBrainRepository: CompanyBrainRepository,
): readonly GameSaveCompanyBrainSnapshotV3[] {
  return Object.freeze(
    [...companyBrainRepository.findAll()]
      .sort((left, right) => left.getCompanyId().value.localeCompare(right.getCompanyId().value))
      .map((brain) => {
        const activeStrategy = brain.getActiveStrategy();

        return Object.freeze({
          brainId: brain.getId().value,
          companyId: brain.getCompanyId().value,
          createdAt: brain.getCreatedAt(),
          ...(activeStrategy !== undefined
            ? {
                activeStrategy: Object.freeze({
                  strategyDefinitionId: activeStrategy.strategyDefinitionId,
                  appliedAtTick: activeStrategy.appliedAtTick,
                }),
              }
            : {}),
          goals: Object.freeze(brain.getGoals().map(serializeGoal)),
          knowledge: Object.freeze(
            [...brain.getKnowledge()]
              .sort((left, right) => {
                const kindCompare = left.kind.localeCompare(right.kind);

                if (kindCompare !== 0) {
                  return kindCompare;
                }

                return left.id.value.localeCompare(right.id.value);
              })
              .map(serializeKnowledge),
          ),
          memory: Object.freeze(
            [...brain.getMemory()]
              .sort((left, right) => {
                if (left.observedAtTick !== right.observedAtTick) {
                  return left.observedAtTick - right.observedAtTick;
                }

                return left.id.value.localeCompare(right.id.value);
              })
              .map(serializeMemory),
          ),
          decisionQueue: Object.freeze(brain.getDecisions().map(serializeDecision)),
        });
      }),
  );
}

/** Restores a company brain aggregate from a V3 snapshot row. */
export function restoreCompanyBrain(snapshot: GameSaveCompanyBrainSnapshotV3) {
  const brainIdResult = createCompanyBrainId(snapshot.brainId);

  if (!brainIdResult.ok) {
    return brainIdResult;
  }

  const companyIdResult = createCompanyId(snapshot.companyId);

  if (!companyIdResult.ok) {
    return companyIdResult;
  }

  const goals: Goal[] = [];

  for (const goalSnapshot of snapshot.goals) {
    const goalResult = restoreGoal(goalSnapshot);

    if (!goalResult.ok) {
      return goalResult;
    }

    goals.push(goalResult.value);
  }

  const knowledge: KnowledgeEntry[] = [];

  for (const knowledgeSnapshot of snapshot.knowledge) {
    const knowledgeResult = restoreKnowledge(knowledgeSnapshot);

    if (!knowledgeResult.ok) {
      return knowledgeResult;
    }

    knowledge.push(knowledgeResult.value);
  }

  const memory: MemoryEntry[] = [];

  for (const memorySnapshot of snapshot.memory) {
    const memoryResult = restoreMemory(memorySnapshot);

    if (!memoryResult.ok) {
      return memoryResult;
    }

    memory.push(memoryResult.value);
  }

  const decisions: CompanyDecision[] = [];

  for (const decisionSnapshot of snapshot.decisionQueue) {
    const decisionResult = restoreDecision(decisionSnapshot);

    if (!decisionResult.ok) {
      return decisionResult;
    }

    decisions.push(decisionResult.value);
  }

  const activeStrategy =
    snapshot.activeStrategy === undefined
      ? undefined
      : new ActiveStrategy({
          strategyDefinitionId: snapshot.activeStrategy.strategyDefinitionId,
          appliedAtTick: snapshot.activeStrategy.appliedAtTick,
        });

  return CompanyBrain.restore({
    id: brainIdResult.value,
    companyId: companyIdResult.value,
    createdAt: snapshot.createdAt,
    ...(activeStrategy !== undefined ? { activeStrategy } : {}),
    goals,
    knowledge,
    memory,
    decisions,
  });
}

function serializeGoal(goal: Goal): GameSaveGoalSnapshotV3 {
  return Object.freeze({
    id: goal.id.value,
    kind: goal.kind,
    description: goal.description,
    priority: goal.priority,
    status: goal.status,
    createdAtTick: goal.createdAtTick,
    ...(goal.regionId !== undefined ? { regionId: goal.regionId } : {}),
    ...(goal.resourceId !== undefined ? { resourceId: goal.resourceId } : {}),
    ...(goal.buildingTypeId !== undefined ? { buildingTypeId: goal.buildingTypeId } : {}),
    ...(goal.technologyId !== undefined ? { technologyId: goal.technologyId } : {}),
  });
}

function restoreGoal(snapshot: GameSaveGoalSnapshotV3): Result<Goal, ValidationError> {
  const goalIdResult = createGoalId(snapshot.id);

  if (!goalIdResult.ok) {
    return goalIdResult;
  }

  return Result.ok(
    new Goal({
      id: goalIdResult.value,
      kind: snapshot.kind as GoalKind,
      description: snapshot.description,
      priority: snapshot.priority,
      status: snapshot.status as GoalStatus,
      createdAtTick: snapshot.createdAtTick,
      ...(snapshot.regionId !== undefined ? { regionId: snapshot.regionId } : {}),
      ...(snapshot.resourceId !== undefined ? { resourceId: snapshot.resourceId } : {}),
      ...(snapshot.buildingTypeId !== undefined ? { buildingTypeId: snapshot.buildingTypeId } : {}),
      ...(snapshot.technologyId !== undefined ? { technologyId: snapshot.technologyId } : {}),
    }),
  );
}

function serializeKnowledge(entry: KnowledgeEntry): GameSaveKnowledgeSnapshotV3 {
  return Object.freeze({
    id: entry.id.value,
    kind: entry.kind,
    key: entry.key,
    observedAtTick: entry.observedAtTick,
    value: serializeKnowledgeValue(entry.value),
    ...(entry.regionId !== undefined ? { regionId: entry.regionId } : {}),
    ...(entry.resourceId !== undefined ? { resourceId: entry.resourceId } : {}),
    ...(entry.companyId !== undefined ? { companyId: entry.companyId } : {}),
    ...(entry.technologyId !== undefined ? { technologyId: entry.technologyId } : {}),
  });
}

function serializeKnowledgeValue(value: KnowledgeValue): GameSaveKnowledgeSnapshotV3['value'] {
  switch (value.kind) {
    case 'NUMBER':
      return Object.freeze({ kind: 'NUMBER', value: value.value });
    case 'STRING':
      return Object.freeze({ kind: 'STRING', value: value.value });
    case 'BOOLEAN':
      return Object.freeze({ kind: 'BOOLEAN', value: value.value });
  }
}

function restoreKnowledge(
  snapshot: GameSaveKnowledgeSnapshotV3,
): Result<KnowledgeEntry, ValidationError> {
  const idResult = createKnowledgeEntryId(snapshot.id);

  if (!idResult.ok) {
    return idResult;
  }

  return Result.ok(
    new KnowledgeEntry({
      id: idResult.value,
      kind: snapshot.kind as KnowledgeKind,
      key: snapshot.key,
      observedAtTick: snapshot.observedAtTick,
      value: snapshot.value as KnowledgeValue,
      ...(snapshot.regionId !== undefined ? { regionId: snapshot.regionId } : {}),
      ...(snapshot.resourceId !== undefined ? { resourceId: snapshot.resourceId } : {}),
      ...(snapshot.companyId !== undefined ? { companyId: snapshot.companyId } : {}),
      ...(snapshot.technologyId !== undefined ? { technologyId: snapshot.technologyId } : {}),
    }),
  );
}

function serializeMemory(entry: MemoryEntry): GameSaveMemorySnapshotV3 {
  const payload: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(entry.payload)) {
    payload[key] = value;
  }

  return Object.freeze({
    id: entry.id.value,
    kind: entry.kind,
    observedAtTick: entry.observedAtTick,
    payload: orderMemoryPayload(payload),
    ...(entry.expiresAtTick !== undefined ? { expiresAtTick: entry.expiresAtTick } : {}),
    ...(entry.regionId !== undefined ? { regionId: entry.regionId } : {}),
    ...(entry.resourceId !== undefined ? { resourceId: entry.resourceId } : {}),
    ...(entry.companyId !== undefined ? { companyId: entry.companyId } : {}),
  });
}

function restoreMemory(snapshot: GameSaveMemorySnapshotV3): Result<MemoryEntry, ValidationError> {
  const idResult = createMemoryEntryId(snapshot.id);

  if (!idResult.ok) {
    return idResult;
  }

  return Result.ok(
    new MemoryEntry({
      id: idResult.value,
      kind: snapshot.kind as MemoryKind,
      observedAtTick: snapshot.observedAtTick,
      payload: orderMemoryPayload(snapshot.payload),
      ...(snapshot.expiresAtTick !== undefined ? { expiresAtTick: snapshot.expiresAtTick } : {}),
      ...(snapshot.regionId !== undefined ? { regionId: snapshot.regionId } : {}),
      ...(snapshot.resourceId !== undefined ? { resourceId: snapshot.resourceId } : {}),
      ...(snapshot.companyId !== undefined ? { companyId: snapshot.companyId } : {}),
    }),
  );
}

function serializeDecision(decision: CompanyDecision): GameSaveCompanyDecisionSnapshotV3 {
  return Object.freeze({
    id: decision.id.value,
    type: decision.type,
    status: decision.status,
    layer: decision.layer,
    priority: decision.priority,
    createdAtTick: decision.createdAtTick,
    payload: decision.payload as GameSaveCompanyDecisionPayloadSnapshotV3,
  });
}

function restoreDecision(
  snapshot: GameSaveCompanyDecisionSnapshotV3,
): Result<CompanyDecision, ValidationError> {
  const idResult = createCompanyDecisionId(snapshot.id);

  if (!idResult.ok) {
    return idResult;
  }

  return Result.ok(
    new CompanyDecision({
      id: idResult.value,
      type: snapshot.type as CompanyDecisionType,
      status: snapshot.status as CompanyDecisionStatus,
      layer: snapshot.layer as PlanningLayer,
      priority: snapshot.priority,
      createdAtTick: snapshot.createdAtTick,
      payload: snapshot.payload as CompanyDecisionPayload,
    }),
  );
}
