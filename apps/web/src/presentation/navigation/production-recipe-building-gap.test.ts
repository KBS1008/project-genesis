import { describe, expect, it } from 'vitest';
import { resolveProductionRecipeBuildingGap } from '@/presentation/navigation/production-recipe-building-gap';

describe('resolveProductionRecipeBuildingGap', () => {
  it('returns sawmill gap when recipe is eligible but no sawmill is placed', () => {
    const gap = resolveProductionRecipeBuildingGap({
      progressionEligible: true,
      buildingTypeIds: ['sawmill'],
      buildingTypeLabels: ['Sägewerk'],
      recipeProductionHintCount: 0,
      placedBuildingTypeIds: new Set(['warehouse']),
    });

    expect(gap).toEqual({
      buildingTypeId: 'sawmill',
      buildingTypeLabel: 'Sägewerk',
    });
  });

  it('returns null when progression is blocked', () => {
    expect(
      resolveProductionRecipeBuildingGap({
        progressionEligible: false,
        buildingTypeIds: ['sawmill'],
        buildingTypeLabels: ['Sägewerk'],
        recipeProductionHintCount: 0,
        placedBuildingTypeIds: new Set(),
      }),
    ).toBeNull();
  });

  it('returns null when production hints exist for the recipe', () => {
    expect(
      resolveProductionRecipeBuildingGap({
        progressionEligible: true,
        buildingTypeIds: ['sawmill'],
        buildingTypeLabels: ['Sägewerk'],
        recipeProductionHintCount: 1,
        placedBuildingTypeIds: new Set(['sawmill']),
      }),
    ).toBeNull();
  });

  it('returns null when a required building type is already placed', () => {
    expect(
      resolveProductionRecipeBuildingGap({
        progressionEligible: true,
        buildingTypeIds: ['sawmill'],
        buildingTypeLabels: ['Sägewerk'],
        recipeProductionHintCount: 0,
        placedBuildingTypeIds: new Set(['sawmill']),
      }),
    ).toBeNull();
  });
});