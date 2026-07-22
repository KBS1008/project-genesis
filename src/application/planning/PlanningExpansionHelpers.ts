/**
 * @module @application/planning/PlanningExpansionHelpers
 *
 * Deterministic helpers for expansion and production planning decisions.
 */

/** Computes a deterministic grid position for a new building. */
export function computeDeterministicBuildingPlacement(buildingCount: number): {
  readonly x: number;
  readonly y: number;
} {
  const slot = buildingCount + 1;

  return Object.freeze({
    x: slot * 4,
    y: (slot % 5) * 4,
  });
}

/** Creates a deterministic building id for planned construction. */
export function createPlannedBuildingId(
  companyId: string,
  buildingTypeId: string,
  tickNumber: number,
): string {
  return `building_${companyId}_${buildingTypeId}_${tickNumber}`;
}

/** Creates a deterministic production job id for planned production. */
export function createPlannedProductionJobId(
  companyId: string,
  buildingId: string,
  tickNumber: number,
): string {
  return `production_${companyId}_${buildingId}_${tickNumber}`;
}

/** Creates a deterministic research job id for planned research. */
export function createPlannedResearchJobId(
  companyId: string,
  technologyId: string,
  tickNumber: number,
): string {
  return `research_${companyId}_${technologyId}_${tickNumber}`;
}
