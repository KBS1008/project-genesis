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

/** Building types covered by ICON-003 production batch 2 (B2 primary + compact). */
export const ICON_003_BATCH_2_BUILDING_TYPE_IDS = Object.freeze([
  'assembly_plant',
  'headquarters',
  'electronics_factory',
  'consumer_goods_plant',
  'solar_power_plant',
  'distribution_center',
  'university',
  'power_substation',
] as const);

export type Icon003Batch2BuildingTypeId = (typeof ICON_003_BATCH_2_BUILDING_TYPE_IDS)[number];

/** Building types covered by ICON-003 production batch 3 (final normal B2 batch). */
export const ICON_003_BATCH_3_BUILDING_TYPE_IDS = Object.freeze([
  'maintenance_facility',
  'recycling_facility',
  'regional_headquarters',
  'training_center',
] as const);

export type Icon003Batch3BuildingTypeId = (typeof ICON_003_BATCH_3_BUILDING_TYPE_IDS)[number];

/** Building types covered by ICON-003 infrastructure production (LINEAR + TERMINAL/YARD). */
export const ICON_003_INFRASTRUCTURE_BUILDING_TYPE_IDS = Object.freeze([
  'access_road',
  'port',
  'rail_terminal',
] as const);

export type Icon003InfrastructureBuildingTypeId = (typeof ICON_003_INFRASTRUCTURE_BUILDING_TYPE_IDS)[number];

export const ICON_003_PRODUCTION_BUILDING_TYPE_IDS = Object.freeze([
  ...ICON_003_BATCH_1_BUILDING_TYPE_IDS,
  ...ICON_003_BATCH_2_BUILDING_TYPE_IDS,
  ...ICON_003_BATCH_3_BUILDING_TYPE_IDS,
  ...ICON_003_INFRASTRUCTURE_BUILDING_TYPE_IDS,
] as const);

export type Icon003ProductionBuildingTypeId = (typeof ICON_003_PRODUCTION_BUILDING_TYPE_IDS)[number];

const BATCH_1_SET = new Set<string>(ICON_003_BATCH_1_BUILDING_TYPE_IDS);
const BATCH_2_SET = new Set<string>(ICON_003_BATCH_2_BUILDING_TYPE_IDS);
const BATCH_3_SET = new Set<string>(ICON_003_BATCH_3_BUILDING_TYPE_IDS);
const INFRASTRUCTURE_SET = new Set<string>(ICON_003_INFRASTRUCTURE_BUILDING_TYPE_IDS);
const PRODUCTION_SET = new Set<string>(ICON_003_PRODUCTION_BUILDING_TYPE_IDS);

export function isIcon003Batch1BuildingType(buildingTypeId: string): buildingTypeId is Icon003Batch1BuildingTypeId {
  return BATCH_1_SET.has(buildingTypeId);
}

export function isIcon003Batch2BuildingType(buildingTypeId: string): buildingTypeId is Icon003Batch2BuildingTypeId {
  return BATCH_2_SET.has(buildingTypeId);
}

export function isIcon003Batch3BuildingType(buildingTypeId: string): buildingTypeId is Icon003Batch3BuildingTypeId {
  return BATCH_3_SET.has(buildingTypeId);
}

export function isIcon003InfrastructureBuildingType(
  buildingTypeId: string,
): buildingTypeId is Icon003InfrastructureBuildingTypeId {
  return INFRASTRUCTURE_SET.has(buildingTypeId);
}

export function isIcon003ProductionBuildingType(
  buildingTypeId: string,
): buildingTypeId is Icon003ProductionBuildingTypeId {
  return PRODUCTION_SET.has(buildingTypeId);
}

export function buildingTypeToIcon003PrimaryAssetId(buildingTypeId: string): string | null {
  if (!isIcon003ProductionBuildingType(buildingTypeId)) {
    return null;
  }

  return `ICON-003-${buildingTypeId}`;
}

export function buildingTypeToIcon003CompactAssetId(buildingTypeId: string): string | null {
  if (!isIcon003ProductionBuildingType(buildingTypeId)) {
    return null;
  }

  return `ICON-003-${buildingTypeId}-compact`;
}

/** Category fallback when type art is unavailable (ICON-002). */
export function buildingCategoryFallbackIconAssetId(category: string): string | null {
  return buildingCategoryToIconAssetId(category);
}
