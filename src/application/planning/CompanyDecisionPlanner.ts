/**
 * @module @application/planning/CompanyDecisionPlanner
 *
 * Generates queued company decisions from goals and analysis.
 */

import type { StrategyDefinition } from '../../content/strategy/StrategyDefinition.js';
import { CompanyDecision } from '../../domain/brain/CompanyDecision.js';
import { CompanyDecisionStatus } from '../../domain/brain/CompanyDecisionStatus.js';
import { CompanyDecisionType } from '../../domain/brain/CompanyDecisionType.js';
import { createCompanyDecisionId } from '../../domain/brain/CompanyDecisionId.js';
import type { Goal } from '../../domain/brain/Goal.js';
import { GoalKind } from '../../domain/brain/GoalKind.js';
import { GoalStatus } from '../../domain/brain/GoalStatus.js';
import {
  PLANNING_LAYER_PRIORITY_BASE,
  type PlanningLayer,
} from '../../domain/brain/PlanningLayer.js';
import type { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import { PLANNING_MAX_TRADE_BATCH } from './PlanningConstants.js';
import {
  computeDeterministicBuildingPlacement,
  createPlannedBuildingId,
  createPlannedProductionJobId,
  createPlannedResearchJobId,
} from './PlanningExpansionHelpers.js';
import type { PlanningAnalysis } from './PlanningAnalysis.js';
import type { PlanningObservation } from './PlanningObservation.js';

/**
 * Generates executable decisions for one planning layer.
 */
export class CompanyDecisionPlanner {
  /** Creates decision proposals from active goals and analysis. */
  plan(params: {
    readonly observation: PlanningObservation;
    readonly analysis: PlanningAnalysis;
    readonly strategy: StrategyDefinition;
    readonly layer: PlanningLayer;
    readonly goals: readonly Goal[];
    readonly brain: CompanyBrain;
    readonly sequenceStart: number;
  }): readonly CompanyDecision[] {
    const decisions: CompanyDecision[] = [];
    let sequence = params.sequenceStart;

    for (const goal of params.goals) {
      if (goal.status !== GoalStatus.ACTIVE) {
        continue;
      }

      const decision = this.#decisionForGoal(params, goal, sequence);

      if (decision === undefined) {
        continue;
      }

      if (this.#hasPendingDecision(params.brain, decision)) {
        continue;
      }

      decisions.push(decision);
      sequence += 1;
    }

    return Object.freeze(decisions);
  }

  #decisionForGoal(
    params: {
      readonly observation: PlanningObservation;
      readonly analysis: PlanningAnalysis;
      readonly strategy: StrategyDefinition;
      readonly layer: PlanningLayer;
    },
    goal: Goal,
    sequence: number,
  ): CompanyDecision | undefined {
    const basePriority = PLANNING_LAYER_PRIORITY_BASE[params.layer];

    if (goal.kind === GoalKind.SECURE_SUPPLY && goal.resourceId !== undefined) {
      const shortage = params.analysis.resourceShortages.find(
        (entry) => entry.resourceId === goal.resourceId,
      );

      if (shortage === undefined) {
        return undefined;
      }

      const quantity = Math.min(
        PLANNING_MAX_TRADE_BATCH,
        Math.max(1, shortage.targetStock - shortage.available),
      );

      return this.#createDecision({
        companyId: params.observation.companyId,
        tickNumber: params.observation.tickNumber,
        sequence,
        layer: params.layer,
        priority: basePriority + params.strategy.weights.tradingWeight,
        type: CompanyDecisionType.PURCHASE_RESOURCE,
        payload: {
          type: 'PURCHASE_RESOURCE',
          data: {
            resourceId: goal.resourceId,
            quantity,
            regionId: params.observation.primaryRegionId,
          },
        },
      });
    }

    if (goal.kind === GoalKind.IMPROVE_PROFITABILITY && goal.resourceId !== undefined) {
      const surplus = params.analysis.resourceSurpluses.find(
        (entry) => entry.resourceId === goal.resourceId,
      );

      if (surplus === undefined) {
        return undefined;
      }

      const quantity = Math.min(PLANNING_MAX_TRADE_BATCH, Math.max(1, surplus.surplus));

      return this.#createDecision({
        companyId: params.observation.companyId,
        tickNumber: params.observation.tickNumber,
        sequence,
        layer: params.layer,
        priority: basePriority + params.strategy.weights.tradingWeight,
        type: CompanyDecisionType.SELL_RESOURCE,
        payload: {
          type: 'SELL_RESOURCE',
          data: {
            resourceId: goal.resourceId,
            quantity,
            regionId: params.observation.primaryRegionId,
          },
        },
      });
    }

    if (
      goal.kind === GoalKind.INCREASE_PRODUCTION &&
      params.analysis.productionCandidate !== undefined
    ) {
      const candidate = params.analysis.productionCandidate;

      return this.#createDecision({
        companyId: params.observation.companyId,
        tickNumber: params.observation.tickNumber,
        sequence,
        layer: params.layer,
        priority: basePriority + params.strategy.weights.productionWeight,
        type: CompanyDecisionType.START_PRODUCTION,
        payload: {
          type: 'START_PRODUCTION',
          data: {
            buildingId: candidate.buildingId,
            recipeId: candidate.recipeId,
            batches: 1,
            jobId: createPlannedProductionJobId(
              params.observation.companyId,
              candidate.buildingId,
              params.observation.tickNumber,
            ),
          },
        },
      });
    }

    if (
      goal.kind === GoalKind.EXPAND_REGION &&
      params.analysis.expansionAffordable &&
      params.analysis.expansionBuildingTypeId !== undefined
    ) {
      const buildingTypeId = params.analysis.expansionBuildingTypeId;
      const placement = computeDeterministicBuildingPlacement(params.observation.buildings.length);
      const buildingId = createPlannedBuildingId(
        params.observation.companyId,
        buildingTypeId,
        params.observation.tickNumber,
      );

      return this.#createDecision({
        companyId: params.observation.companyId,
        tickNumber: params.observation.tickNumber,
        sequence,
        layer: params.layer,
        priority: basePriority + params.strategy.weights.expansionWeight,
        type: CompanyDecisionType.PLACE_BUILDING,
        payload: {
          type: 'PLACE_BUILDING',
          data: {
            buildingId,
            buildingTypeId,
            name: `${buildingTypeId} (planned)`,
            regionId: params.observation.primaryRegionId,
            mapX: placement.x,
            mapY: placement.y,
          },
        },
      });
    }

    if (
      goal.kind === GoalKind.INVEST_RESEARCH &&
      params.analysis.researchCandidateTechnologyId !== undefined
    ) {
      const technologyId = params.analysis.researchCandidateTechnologyId;

      return this.#createDecision({
        companyId: params.observation.companyId,
        tickNumber: params.observation.tickNumber,
        sequence,
        layer: params.layer,
        priority: basePriority + params.strategy.weights.researchWeight,
        type: CompanyDecisionType.START_RESEARCH,
        payload: {
          type: 'START_RESEARCH',
          data: {
            jobId: createPlannedResearchJobId(
              params.observation.companyId,
              technologyId,
              params.observation.tickNumber,
            ),
            technologyId,
          },
        },
      });
    }

    return undefined;
  }

  #createDecision(params: {
    companyId: string;
    tickNumber: number;
    sequence: number;
    layer: PlanningLayer;
    priority: number;
    type: (typeof CompanyDecisionType)[keyof typeof CompanyDecisionType];
    payload: CompanyDecision['payload'];
  }): CompanyDecision {
    const decisionIdResult = createCompanyDecisionId(
      `decision_${params.companyId}_${params.type}_${params.tickNumber}_${params.sequence}`,
    );

    if (!decisionIdResult.ok) {
      throw new Error(decisionIdResult.error.message);
    }

    return new CompanyDecision({
      id: decisionIdResult.value,
      type: params.type,
      status: CompanyDecisionStatus.PENDING,
      layer: params.layer,
      priority: params.priority,
      createdAtTick: params.tickNumber,
      payload: params.payload,
    });
  }

  #hasPendingDecision(brain: CompanyBrain, decision: CompanyDecision): boolean {
    return brain.getPendingDecisions().some((pending) => {
      if (pending.type !== decision.type) {
        return false;
      }

      if (pending.payload.type !== decision.payload.type) {
        return false;
      }

      if (pending.payload.type === 'PURCHASE_RESOURCE' && decision.payload.type === 'PURCHASE_RESOURCE') {
        return (
          pending.payload.data.resourceId === decision.payload.data.resourceId &&
          pending.payload.data.regionId === decision.payload.data.regionId
        );
      }

      if (pending.payload.type === 'SELL_RESOURCE' && decision.payload.type === 'SELL_RESOURCE') {
        return (
          pending.payload.data.resourceId === decision.payload.data.resourceId &&
          pending.payload.data.regionId === decision.payload.data.regionId
        );
      }

      if (
        pending.payload.type === 'START_PRODUCTION' &&
        decision.payload.type === 'START_PRODUCTION'
      ) {
        return (
          pending.payload.data.buildingId === decision.payload.data.buildingId &&
          pending.payload.data.recipeId === decision.payload.data.recipeId
        );
      }

      if (pending.payload.type === 'PLACE_BUILDING' && decision.payload.type === 'PLACE_BUILDING') {
        return pending.payload.data.buildingId === decision.payload.data.buildingId;
      }

      if (pending.payload.type === 'START_RESEARCH' && decision.payload.type === 'START_RESEARCH') {
        return pending.payload.data.technologyId === decision.payload.data.technologyId;
      }

      return false;
    });
  }
}
