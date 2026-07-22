/**
 * @module @application/planning/CompanyGoalPlanner
 *
 * Generates company goals from planning analysis and strategy weights.
 */

import type { StrategyDefinition } from '../../content/strategy/StrategyDefinition.js';
import { Goal } from '../../domain/brain/Goal.js';
import { GoalKind } from '../../domain/brain/GoalKind.js';
import { GoalStatus } from '../../domain/brain/GoalStatus.js';
import { createGoalId } from '../../domain/brain/GoalId.js';
import { PlanningLayer as PlanningLayerValues, type PlanningLayer } from '../../domain/brain/PlanningLayer.js';
import type { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import type { PlanningAnalysis } from './PlanningAnalysis.js';
import type { PlanningObservation } from './PlanningObservation.js';

/** Creates a deterministic goal identifier. */
export function createDeterministicGoalId(
  companyId: string,
  kind: string,
  resourceId?: string,
  regionId?: string,
): string {
  return `goal_${companyId}_${kind}_${regionId ?? 'global'}_${resourceId ?? 'none'}`;
}

/**
 * Generates goals for one planning layer without mutating repositories.
 */
export class CompanyGoalPlanner {
  /** Creates goal proposals for the active planning layer. */
  plan(params: {
    readonly observation: PlanningObservation;
    readonly analysis: PlanningAnalysis;
    readonly strategy: StrategyDefinition;
    readonly layer: PlanningLayer;
    readonly brain: CompanyBrain;
  }): readonly Goal[] {
    const goals: Goal[] = [];
    const { observation, analysis, strategy, layer, brain } = params;

    if (
      layer === PlanningLayerValues.TACTICAL &&
      analysis.liquidityPressure &&
      strategy.weights.liquidityPreference >= 40
    ) {
      goals.push(this.#createGoalIfMissing(brain, {
        companyId: observation.companyId,
        tickNumber: observation.tickNumber,
        kind: GoalKind.STABILIZE_LIQUIDITY,
        description: 'Maintain sufficient cash reserves',
        priority: strategy.weights.liquidityPreference,
      }));
    }

    if (
      layer === PlanningLayerValues.TACTICAL &&
      analysis.costPressure &&
      strategy.weights.liquidityPreference >= 30
    ) {
      goals.push(this.#createGoalIfMissing(brain, {
        companyId: observation.companyId,
        tickNumber: observation.tickNumber,
        kind: GoalKind.REDUCE_COSTS,
        description: 'Reduce operating costs and preserve cash',
        priority: strategy.weights.liquidityPreference - 5,
      }));
    }

    if (layer === PlanningLayerValues.TACTICAL || layer === PlanningLayerValues.OPERATIONAL) {
      for (const shortage of analysis.resourceShortages) {
        goals.push(
          this.#createGoalIfMissing(brain, {
            companyId: observation.companyId,
            tickNumber: observation.tickNumber,
            kind: GoalKind.SECURE_SUPPLY,
            description: `Secure supply for ${shortage.resourceId}`,
            priority: strategy.weights.productionWeight + 10,
            resourceId: shortage.resourceId,
          }),
        );
      }
    }

    if (layer === PlanningLayerValues.OPERATIONAL) {
      for (const surplus of analysis.resourceSurpluses) {
        if (strategy.weights.tradingWeight < 30) {
          continue;
        }

        goals.push(
          this.#createGoalIfMissing(brain, {
            companyId: observation.companyId,
            tickNumber: observation.tickNumber,
            kind: GoalKind.IMPROVE_PROFITABILITY,
            description: `Sell surplus ${surplus.resourceId}`,
            priority: strategy.weights.tradingWeight,
            resourceId: surplus.resourceId,
            regionId: observation.primaryRegionId,
          }),
        );
      }

      if (
        analysis.productionCandidate !== undefined &&
        strategy.weights.productionWeight >= 40
      ) {
        goals.push(
          this.#createGoalIfMissing(brain, {
            companyId: observation.companyId,
            tickNumber: observation.tickNumber,
            kind: GoalKind.INCREASE_PRODUCTION,
            description: `Start production on ${analysis.productionCandidate.buildingId}`,
            priority: strategy.weights.productionWeight,
            resourceId: analysis.productionCandidate.recipeId,
          }),
        );
      }
    }

    if (
      (layer === PlanningLayerValues.STRATEGIC ||
        (layer === PlanningLayerValues.OPERATIONAL &&
          analysis.expansionAffordable &&
          analysis.expansionBuildingTypeId !== undefined)) &&
      !analysis.liquidityPressure &&
      strategy.weights.expansionWeight >= 60
    ) {
      const expansionRegionId =
        analysis.expansionTargetRegionId ?? observation.primaryRegionId;

      goals.push(
        this.#createGoalIfMissing(brain, {
          companyId: observation.companyId,
          tickNumber: observation.tickNumber,
          kind: GoalKind.EXPAND_REGION,
          description: 'Evaluate regional expansion opportunities',
          priority: strategy.weights.expansionWeight,
          regionId: expansionRegionId,
        }),
      );
    }

    if (layer === PlanningLayerValues.STRATEGIC) {
      if (
        strategy.weights.researchWeight >= 60 &&
        analysis.researchCandidateTechnologyId !== undefined
      ) {
        goals.push(
          this.#createGoalIfMissing(brain, {
            companyId: observation.companyId,
            tickNumber: observation.tickNumber,
            kind: GoalKind.INVEST_RESEARCH,
            description: 'Prioritise technology research',
            priority: strategy.weights.researchWeight,
            resourceId: analysis.researchCandidateTechnologyId,
          }),
        );
      }
    }

    return Object.freeze(goals);
  }

  #createGoalIfMissing(
    brain: CompanyBrain,
    params: {
      companyId: string;
      tickNumber: number;
      kind: (typeof GoalKind)[keyof typeof GoalKind];
      description: string;
      priority: number;
      resourceId?: string;
      regionId?: string;
    },
  ): Goal {
    const goalIdValue = createDeterministicGoalId(
      params.companyId,
      params.kind,
      params.resourceId,
      params.regionId,
    );

    const existing = brain.getGoals().find((goal) => goal.id.value === goalIdValue);

    if (existing !== undefined) {
      return existing;
    }

    const goalIdResult = createGoalId(goalIdValue);

    if (!goalIdResult.ok) {
      throw new Error(goalIdResult.error.message);
    }

    return new Goal({
      id: goalIdResult.value,
      kind: params.kind,
      description: params.description,
      priority: params.priority,
      status: GoalStatus.ACTIVE,
      createdAtTick: params.tickNumber,
      ...(params.regionId !== undefined ? { regionId: params.regionId } : {}),
      ...(params.resourceId !== undefined ? { resourceId: params.resourceId } : {}),
    });
  }
}
