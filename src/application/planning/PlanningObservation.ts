/**
 * @module @application/planning/PlanningObservation
 *
 * Immutable snapshot of observable simulation state for company planning.
 */

/** Observed inventory line for one resource. */
export type ObservedInventoryLine = {
  readonly resourceId: string;
  readonly available: number;
};

/** Observed market price in one region. */
export type ObservedMarketPrice = {
  readonly regionId: string;
  readonly resourceId: string;
  readonly lastPrice: number;
  readonly basePrice: number;
};

/** Observed building owned by a company. */
export type ObservedBuilding = {
  readonly buildingId: string;
  readonly buildingTypeId: string;
  readonly regionId: string;
  readonly status: string;
  readonly x: number;
  readonly y: number;
};

/** Read-only observation input for the planning pipeline. */
export type PlanningObservation = {
  readonly companyId: string;
  readonly tickNumber: number;
  readonly cashBalance: number;
  readonly availableCash: number;
  readonly inventory: readonly ObservedInventoryLine[];
  readonly regionIds: readonly string[];
  readonly primaryRegionId: string;
  readonly marketPrices: readonly ObservedMarketPrice[];
  readonly buildings: readonly ObservedBuilding[];
  readonly completedTechnologyIds: readonly string[];
  readonly activeResearchTechnologyIds: readonly string[];
  readonly completedMilestoneIds: readonly string[];
  readonly runningProductionJobBuildingIds: readonly string[];
};

/** Creates a frozen planning observation snapshot. */
export function createPlanningObservation(
  observation: PlanningObservation,
): PlanningObservation {
  return Object.freeze({
    ...observation,
    inventory: Object.freeze([...observation.inventory]),
    regionIds: Object.freeze([...observation.regionIds]),
    marketPrices: Object.freeze([...observation.marketPrices]),
    buildings: Object.freeze([...observation.buildings]),
    completedTechnologyIds: Object.freeze([...observation.completedTechnologyIds]),
    activeResearchTechnologyIds: Object.freeze([...observation.activeResearchTechnologyIds]),
    completedMilestoneIds: Object.freeze([...observation.completedMilestoneIds]),
    runningProductionJobBuildingIds: Object.freeze([
      ...observation.runningProductionJobBuildingIds,
    ]),
  });
}
