/** Enabled production recipe IDs (mirrors game-content/recipes/*.yaml). */
export const ICON_005_ENABLED_RECIPE_IDS = Object.freeze([
  'recipe_planks',
  'recipe_advanced_planks',
  'recipe_steel',
  'recipe_machine_parts',
  'recipe_industrial_machinery',
  'recipe_advanced_electronics',
  'recipe_consumer_goods',
] as const);

export type Icon005EnabledRecipeId = (typeof ICON_005_ENABLED_RECIPE_IDS)[number];

/** Human-approved pilot promotions (Batch 1 production). */
export const ICON_005_PILOT_PROMOTED_RECIPE_IDS = Object.freeze([
  'recipe_planks',
  'recipe_steel',
  'recipe_advanced_electronics',
] as const);

const RECIPE_SET = new Set<string>(ICON_005_ENABLED_RECIPE_IDS);

export const ICON_005_GENERIC_PROCESS_FALLBACK_ASSET_ID = 'ICON-002-production';

export function isIcon005ProductionRecipe(recipeId: string): recipeId is Icon005EnabledRecipeId {
  return RECIPE_SET.has(recipeId);
}

export function recipeToIcon005PrimaryAssetId(recipeId: string): string | null {
  if (!isIcon005ProductionRecipe(recipeId)) {
    return null;
  }

  return `ICON-005-${recipeId}-primary`;
}

export function resolveIcon005ProcessVisualAssetIds(recipeId: string): {
  readonly primaryAssetId: string | null;
  readonly fallbackAssetId: string;
} {
  return Object.freeze({
    primaryAssetId: recipeToIcon005PrimaryAssetId(recipeId),
    fallbackAssetId: ICON_005_GENERIC_PROCESS_FALLBACK_ASSET_ID,
  });
}
