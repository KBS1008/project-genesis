/**
 * @module @application/planning/PlanningAnalysis
 *
 * Deterministic analysis derived from a planning observation.
 */

/** Resource with stock below the planning minimum. */
export type ResourceShortage = {
  readonly resourceId: string;
  readonly available: number;
  readonly targetStock: number;
  readonly minimumStock: number;
};

/** Resource with stock above the planning target. */
export type ResourceSurplus = {
  readonly resourceId: string;
  readonly available: number;
  readonly targetStock: number;
  readonly surplus: number;
};

/** Candidate production run derived from observable state. */
export type ProductionCandidate = {
  readonly buildingId: string;
  readonly recipeId: string;
};

/** Result of analysing a planning observation. */
export type PlanningAnalysis = {
  readonly liquidityPressure: boolean;
  readonly liquidityThreshold: number;
  readonly resourceShortages: readonly ResourceShortage[];
  readonly resourceSurpluses: readonly ResourceSurplus[];
  readonly singleRegionOperation: boolean;
  readonly expansionAffordable: boolean;
  readonly expansionBuildingTypeId?: string;
  readonly productionCandidate?: ProductionCandidate;
  readonly researchCandidateTechnologyId?: string;
};

/** Creates a frozen planning analysis result. */
export function createPlanningAnalysis(analysis: PlanningAnalysis): PlanningAnalysis {
  return Object.freeze({
    liquidityPressure: analysis.liquidityPressure,
    liquidityThreshold: analysis.liquidityThreshold,
    resourceShortages: Object.freeze([...analysis.resourceShortages]),
    resourceSurpluses: Object.freeze([...analysis.resourceSurpluses]),
    singleRegionOperation: analysis.singleRegionOperation,
    expansionAffordable: analysis.expansionAffordable,
    ...(analysis.expansionBuildingTypeId !== undefined
      ? { expansionBuildingTypeId: analysis.expansionBuildingTypeId }
      : {}),
    ...(analysis.productionCandidate !== undefined
      ? { productionCandidate: Object.freeze({ ...analysis.productionCandidate }) }
      : {}),
    ...(analysis.researchCandidateTechnologyId !== undefined
      ? { researchCandidateTechnologyId: analysis.researchCandidateTechnologyId }
      : {}),
  });
}
