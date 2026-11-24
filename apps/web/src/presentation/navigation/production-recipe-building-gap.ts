/**
 * Detects when a progression-eligible recipe has no placed building of a required type.
 */

export type ProductionRecipeBuildingGap = {
  readonly buildingTypeId: string;
  readonly buildingTypeLabel: string;
};

export type ResolveProductionRecipeBuildingGapParams = {
  readonly progressionEligible: boolean;
  readonly buildingTypeIds: readonly string[];
  readonly buildingTypeLabels: readonly string[];
  readonly recipeProductionHintCount: number;
  readonly placedBuildingTypeIds: ReadonlySet<string>;
};

export function resolveProductionRecipeBuildingGap(
  params: ResolveProductionRecipeBuildingGapParams,
): ProductionRecipeBuildingGap | null {
  if (!params.progressionEligible) {
    return null;
  }

  if (params.recipeProductionHintCount > 0) {
    return null;
  }

  for (let index = 0; index < params.buildingTypeIds.length; index++) {
    const buildingTypeId = params.buildingTypeIds[index];

    if (buildingTypeId === undefined) {
      continue;
    }

    if (!params.placedBuildingTypeIds.has(buildingTypeId)) {
      const buildingTypeLabel = params.buildingTypeLabels[index] ?? buildingTypeId;

      return Object.freeze({
        buildingTypeId,
        buildingTypeLabel,
      });
    }
  }

  return null;
}