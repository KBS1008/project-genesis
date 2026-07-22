/**
 * @module @application/planning/CompanyPlanningAnalyser
 *
 * Deterministic analysis phase for company planning.
 */

import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import type { StrategyDefinition } from '../../content/strategy/StrategyDefinition.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import {
  computeLiquidityThreshold,
  computeMinimumStock,
  computeTargetStock,
} from './PlanningConstants.js';
import { createPlanningAnalysis, type PlanningAnalysis } from './PlanningAnalysis.js';
import type { PlanningObservation } from './PlanningObservation.js';

/**
 * Analyses an observation using strategy weights and game content without mutating state.
 */
export class CompanyPlanningAnalyser {
  readonly #gameContent: GameContentLoadResult;

  constructor(gameContent: GameContentLoadResult) {
    this.#gameContent = gameContent;
  }

  /** Derives deterministic planning analysis from an observation. */
  analyse(observation: PlanningObservation, strategy: StrategyDefinition): PlanningAnalysis {
    const targetStock = computeTargetStock(strategy.weights.productionWeight);
    const minimumStock = computeMinimumStock(strategy.weights.liquidityPreference);
    const liquidityThreshold = computeLiquidityThreshold(strategy.weights.liquidityPreference);

    const inventoryByResource = new Map(
      observation.inventory.map((line) => [line.resourceId, line.available]),
    );

    const trackedResources = Object.freeze(
      [...new Set([...inventoryByResource.keys(), ...observation.marketPrices.map((price) => price.resourceId)])].sort(
        (left, right) => left.localeCompare(right),
      ),
    );

    const resourceShortages = trackedResources
      .map((resourceId) => {
        const available = inventoryByResource.get(resourceId) ?? 0;

        if (available >= minimumStock) {
          return undefined;
        }

        return {
          resourceId,
          available,
          targetStock,
          minimumStock,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

    const resourceSurpluses = trackedResources
      .map((resourceId) => {
        const available = inventoryByResource.get(resourceId) ?? 0;

        if (available <= targetStock) {
          return undefined;
        }

        return {
          resourceId,
          available,
          targetStock,
          surplus: available - targetStock,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

    const expansionBuildingTypeId = this.#resolveExpansionBuildingTypeId(observation, strategy);
    const expansionBuilding = expansionBuildingTypeId
      ? this.#gameContent.buildingTypes.get(expansionBuildingTypeId)
      : undefined;
    const expansionAffordable =
      expansionBuilding !== undefined &&
      observation.availableCash >= expansionBuilding.constructionCost;

    const productionCandidate = this.#resolveProductionCandidate(observation);
    const researchCandidateTechnologyId = this.#resolveResearchCandidate(observation);

    return createPlanningAnalysis({
      liquidityPressure: observation.availableCash < liquidityThreshold,
      liquidityThreshold,
      resourceShortages,
      resourceSurpluses,
      singleRegionOperation: observation.regionIds.length <= 1,
      expansionAffordable,
      ...(expansionAffordable && expansionBuildingTypeId !== undefined
        ? { expansionBuildingTypeId }
        : {}),
      ...(productionCandidate !== undefined ? { productionCandidate } : {}),
      ...(researchCandidateTechnologyId !== undefined
        ? { researchCandidateTechnologyId }
        : {}),
    });
  }

  #resolveExpansionBuildingTypeId(
    observation: PlanningObservation,
    strategy: StrategyDefinition,
  ): string | undefined {
    if (strategy.weights.expansionWeight < 40) {
      return undefined;
    }

    const ownedTypes = new Set(observation.buildings.map((building) => building.buildingTypeId));
    const enabledBuildingTypes = this.#gameContent.buildingTypes
      .getAll()
      .filter((buildingType) => buildingType.enabled);

    if (!ownedTypes.has('warehouse')) {
      const warehouse = enabledBuildingTypes.find((buildingType) => buildingType.id === 'warehouse');

      return warehouse?.id;
    }

    if (!ownedTypes.has('sawmill') && strategy.weights.productionWeight >= 40) {
      const sawmill = enabledBuildingTypes.find((buildingType) => buildingType.id === 'sawmill');

      return sawmill?.id;
    }

    return undefined;
  }

  #resolveProductionCandidate(observation: PlanningObservation) {
    const inventoryByResource = new Map(
      observation.inventory.map((line) => [line.resourceId, line.available]),
    );
    const busyBuildingIds = new Set(observation.runningProductionJobBuildingIds);
    const recipes = this.#gameContent.recipes
      .getAll()
      .filter((recipe) => recipe.enabled)
      .sort((left, right) => left.id.localeCompare(right.id));

    for (const recipe of recipes) {
      const hasInputs = recipe.inputs.every(
        (input) => (inventoryByResource.get(input.resource) ?? 0) >= input.amount,
      );

      if (!hasInputs) {
        continue;
      }

      const building = observation.buildings
        .filter(
          (candidate) =>
            candidate.status === BuildingStatus.ACTIVE &&
            recipe.buildingTypes.includes(candidate.buildingTypeId) &&
            !busyBuildingIds.has(candidate.buildingId),
        )
        .sort((left, right) => left.buildingId.localeCompare(right.buildingId))[0];

      if (building === undefined) {
        continue;
      }

      return Object.freeze({
        buildingId: building.buildingId,
        recipeId: recipe.id,
      });
    }

    return undefined;
  }

  #resolveResearchCandidate(observation: PlanningObservation): string | undefined {
    const completedResearch = new Set(observation.completedTechnologyIds);
    const activeResearch = new Set(observation.activeResearchTechnologyIds);
    const completedMilestones = new Set(observation.completedMilestoneIds);

    for (const technology of this.#gameContent.technologies.getAll()) {
      if (!technology.enabled) {
        continue;
      }

      if (completedResearch.has(technology.id) || activeResearch.has(technology.id)) {
        continue;
      }

      if (observation.availableCash < technology.researchCost) {
        continue;
      }

      const researchSatisfied = technology.requiredResearch.every((required) =>
        completedResearch.has(required),
      );

      if (!researchSatisfied) {
        continue;
      }

      const milestonesSatisfied = technology.requiredMilestones.every((required) =>
        completedMilestones.has(required),
      );

      if (!milestonesSatisfied) {
        continue;
      }

      return technology.id;
    }

    return undefined;
  }
}
