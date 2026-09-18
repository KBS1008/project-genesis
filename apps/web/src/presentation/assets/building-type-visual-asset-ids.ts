import { buildingCategoryToIconAssetId } from '@/presentation/assets/building-category-icon-asset-ids';

/** Building types covered by ICON-003 production batch 1 (B2 primary + compact). */
export const ICON_003_BATCH_1_BUILDING_TYPE_IDS = Object.freeze([
  'sawmill',
  'smelter',
  'warehouse',
  'coal_power_plant',
  'machine_shop',
  'logistics_hub',
  'research_campus',
  'corporate_headquarters',
] as const);

export type Icon003Batch1BuildingTypeId = (typeof ICON_003_BATCH_1_BUILDING_TYPE_IDS)[number];

const BATCH_1_SET = new Set<string>(ICON_003_BATCH_1_BUILDING_TYPE_IDS);

export function isIcon003Batch1BuildingType(buildingTypeId: string): buildingTypeId is Icon003Batch1BuildingTypeId {
  return BATCH_1_SET.has(buildingTypeId);
}

export function buildingTypeToIcon003PrimaryAssetId(buildingTypeId: string): string | null {
  if (!isIcon003Batch1BuildingType(buildingTypeId)) {
    return null;
  }

  return `ICON-003-${buildingTypeId}`;
}

export function buildingTypeToIcon003CompactAssetId(buildingTypeId: string): string | null {
  if (!isIcon003Batch1BuildingType(buildingTypeId)) {
    return null;
  }

  return `ICON-003-${buildingTypeId}-compact`;
}

/** Category fallback when type art is unavailable (ICON-002). */
export function buildingCategoryFallbackIconAssetId(category: string): string | null {
  return buildingCategoryToIconAssetId(category);
}
