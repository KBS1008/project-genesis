/**
 * @module @application/planning/CompanyPlanningPipeline
 *
 * Deterministic company planning pipeline for M8.
 *
 * Observe → Analyse → Goals → Strategy → Decisions → Validate → Queue
 *
 * Planning reads repository state and mutates only the company brain aggregate.
 */

import type { StrategyRegistry } from '../../content/strategy/StrategyRegistry.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import type { CompanyBrainRepository } from '../../domain/brain/CompanyBrainRepository.js';
import type { PlanningLayer } from '../../domain/brain/PlanningLayer.js';
import { CompanyPlanningAnalyser } from './CompanyPlanningAnalyser.js';
import { CompanyDecisionPlanner } from './CompanyDecisionPlanner.js';
import { CompanyDecisionValidator } from './CompanyDecisionValidator.js';
import { CompanyGoalPlanner } from './CompanyGoalPlanner.js';
import { CompanyKnowledgePlanner } from './CompanyKnowledgePlanner.js';
import {
  CompanyPlanningObserver,
  resolveStrategyDefinition,
  type CompanyPlanningObserverDependencies,
} from './CompanyPlanningObserver.js';
import { mergePlanningDrafts, type PlanningDraft } from './PlanningDraft.js';
import { resolvePlanningLayersForTick } from './PlanningConstants.js';

/** Dependencies for {@link CompanyPlanningPipeline}. */
export type CompanyPlanningPipelineDependencies = CompanyPlanningObserverDependencies & {
  readonly companyBrainRepository: CompanyBrainRepository;
  readonly strategies: StrategyRegistry;
  readonly gameContent: GameContentLoadResult;
  readonly clock: Clock;
  readonly enqueueEvents?: (events: readonly DomainEvent[]) => void;
};

/** Result summary of one planning run. */
export type CompanyPlanningResult = {
  readonly layersExecuted: readonly PlanningLayer[];
  readonly goalsAdded: number;
  readonly decisionsQueued: number;
};

/**
 * Runs the deterministic planning pipeline for one company.
 */
export class CompanyPlanningPipeline {
  readonly #observer: CompanyPlanningObserver;
  readonly #analyser: CompanyPlanningAnalyser;
  readonly #knowledgePlanner: CompanyKnowledgePlanner;
  readonly #goalPlanner: CompanyGoalPlanner;
  readonly #decisionPlanner: CompanyDecisionPlanner;
  readonly #decisionValidator: CompanyDecisionValidator;
  readonly #companyBrainRepository: CompanyBrainRepository;
  readonly #strategies: StrategyRegistry;
  readonly #clock: Clock;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  constructor(dependencies: CompanyPlanningPipelineDependencies) {
    this.#observer = new CompanyPlanningObserver(dependencies);
    this.#analyser = new CompanyPlanningAnalyser(dependencies.gameContent);
    this.#knowledgePlanner = new CompanyKnowledgePlanner();
    this.#goalPlanner = new CompanyGoalPlanner();
    this.#decisionPlanner = new CompanyDecisionPlanner();
    this.#decisionValidator = new CompanyDecisionValidator();
    this.#companyBrainRepository = dependencies.companyBrainRepository;
    this.#strategies = dependencies.strategies;
    this.#clock = dependencies.clock;
    this.#enqueueEvents = dependencies.enqueueEvents ?? (() => undefined);
  }

  /**
   * Executes planning for one company on the given tick.
   *
   * Only the company brain repository is mutated.
   */
  run(companyId: CompanyId, tickNumber: number): Result<CompanyPlanningResult, ValidationError> {
    const brain = this.#companyBrainRepository.findByCompanyId(companyId);

    if (brain === undefined) {
      return Result.fail(
        new ValidationError(`Company brain for company "${companyId.value}" was not found.`),
      );
    }

    const layers = resolvePlanningLayersForTick(tickNumber);

    if (layers.length === 0) {
      return Result.ok({
        layersExecuted: layers,
        goalsAdded: 0,
        decisionsQueued: 0,
      });
    }

    const observationResult = this.#observer.observe(companyId, tickNumber);

    if (!observationResult.ok) {
      return observationResult;
    }

    const observation = observationResult.value;
    const strategy = resolveStrategyDefinition(
      this.#strategies,
      brain.getActiveStrategy()?.strategyDefinitionId,
    );

    if (strategy === undefined) {
      return Result.fail(new ValidationError('No enabled strategy definition is available for planning.'));
    }

    const analysis = this.#analyser.analyse(observation, strategy);
    const knowledgeDraft = this.#knowledgePlanner.plan(observation);
    const layerDrafts: PlanningDraft[] = [
      {
        knowledgeEntries: knowledgeDraft.knowledgeEntries,
        memoryEntries: knowledgeDraft.memoryEntries,
        goals: Object.freeze([]),
        decisions: Object.freeze([]),
      },
    ];

    let decisionSequence = 0;

    for (const layer of layers) {
      const goals = this.#goalPlanner.plan({
        observation,
        analysis,
        strategy,
        layer,
        brain,
      });

      const decisions = this.#decisionPlanner.plan({
        observation,
        analysis,
        strategy,
        layer,
        goals,
        brain,
        sequenceStart: decisionSequence,
      });

      decisionSequence += decisions.length;

      layerDrafts.push({
        knowledgeEntries: Object.freeze([]),
        memoryEntries: Object.freeze([]),
        goals,
        decisions,
      });
    }

    const mergedDraft = mergePlanningDrafts(layerDrafts);
    const validatedDecisionsResult = this.#decisionValidator.validate(mergedDraft.decisions);

    if (!validatedDecisionsResult.ok) {
      return validatedDecisionsResult;
    }

    const applyResult = this.#applyDraft(brain, {
      ...mergedDraft,
      decisions: validatedDecisionsResult.value,
    });

    if (!applyResult.ok) {
      return applyResult;
    }

    this.#companyBrainRepository.save(brain);
    this.#enqueueEvents(brain.pullDomainEvents());

    return Result.ok({
      layersExecuted: layers,
      goalsAdded: applyResult.value.goalsAdded,
      decisionsQueued: applyResult.value.decisionsQueued,
    });
  }

  #applyDraft(
    brain: CompanyBrain,
    draft: PlanningDraft,
  ): Result<{ goalsAdded: number; decisionsQueued: number }, ValidationError> {
    let goalsAdded = 0;
    let decisionsQueued = 0;

    for (const entry of draft.knowledgeEntries) {
      const recordResult = brain.recordKnowledge(entry);

      if (!recordResult.ok) {
        return recordResult;
      }
    }

    for (const entry of draft.memoryEntries) {
      const recordResult = brain.recordMemory(entry);

      if (!recordResult.ok) {
        return recordResult;
      }
    }

    brain.pruneExpiredMemory(this.#clock.now());

    for (const goal of draft.goals) {
      const existing = brain.getGoals().find((candidate) => candidate.id.value === goal.id.value);

      if (existing !== undefined) {
        continue;
      }

      const addResult = brain.addGoal(goal, this.#clock);

      if (!addResult.ok) {
        return addResult;
      }

      goalsAdded += 1;
    }

    for (const decision of draft.decisions) {
      const enqueueResult = brain.enqueueDecision(decision, this.#clock);

      if (!enqueueResult.ok) {
        return enqueueResult;
      }

      decisionsQueued += 1;
    }

    return Result.ok({ goalsAdded, decisionsQueued });
  }
}
