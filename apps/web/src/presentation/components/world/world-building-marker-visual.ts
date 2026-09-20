import type { BuildingCategoryIconCategory } from '@/presentation/assets/icon-002-certified-svg-sources';
import {
  buildingTypeToIcon003CompactAssetId,
  isIcon003InfrastructureBuildingType,
  isIcon003ProductionBuildingType,
  type Icon003ProductionBuildingTypeId,
} from '@/presentation/assets/building-type-visual-asset-ids';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

/** Chosen after 28 / 34 / 40 experiments — smallest readable silhouette at World fit. */
export const WORLD_BUILDING_MARKER_GLYPH_PX = 34;

/** Building category for ICON-002 fallback (mirrors `game-content/buildings/*.yaml`). */
export const ICON_003_BUILDING_TYPE_TO_CATEGORY = Object.freeze({
  access_road: 'INFRASTRUCTURE',
  assembly_plant: 'PRODUCTION',
  coal_power_plant: 'ENERGY',
  consumer_goods_plant: 'PRODUCTION',
  corporate_headquarters: 'ADMINISTRATION',
  distribution_center: 'STORAGE',
  electronics_factory: 'PRODUCTION',
  headquarters: 'ADMINISTRATION',
  logistics_hub: 'INFRASTRUCTURE',
  machine_shop: 'PRODUCTION',
  maintenance_facility: 'INFRASTRUCTURE',
  port: 'INFRASTRUCTURE',
  power_substation: 'ENERGY',
  rail_terminal: 'INFRASTRUCTURE',
  recycling_facility: 'INFRASTRUCTURE',
  regional_headquarters: 'ADMINISTRATION',
  research_campus: 'RESEARCH',
  sawmill: 'PRODUCTION',
  smelter: 'PRODUCTION',
  solar_power_plant: 'ENERGY',
  training_center: 'ADMINISTRATION',
  university: 'RESEARCH',
  warehouse: 'STORAGE',
} satisfies Record<Icon003ProductionBuildingTypeId, BuildingCategoryIconCategory>);

export type WorldBuildingMarkerVisualSpec = {
  readonly width: number;
  readonly height: number;
  readonly hitSize: number;
  readonly plateRadius: number;
  readonly selectedScale: number;
};

function scaleSpec(
  width: number,
  height: number,
  hitSize: number,
  plateRadius: number,
  clusterScale: number,
): WorldBuildingMarkerVisualSpec {
  return Object.freeze({
    width: Math.round(width * clusterScale),
    height: Math.round(height * clusterScale),
    hitSize: Math.round(hitSize * clusterScale),
    plateRadius: Math.round(plateRadius * clusterScale),
    selectedScale: 1.12,
  });
}

/** Slight scale-down when many buildings share one region (density stress). */
export function resolveWorldBuildingMarkerClusterScale(clusterSize: number): number {
  if (clusterSize >= 6) {
    return 0.88;
  }

  if (clusterSize >= 5) {
    return 0.94;
  }

  return 1;
}

/** Resolves ICON-002 category for fallback when compact art is unavailable. */
export function resolveIcon003BuildingCategory(buildingTypeId: string): BuildingCategoryIconCategory | null {
  if (!isIcon003ProductionBuildingType(buildingTypeId)) {
    return null;
  }

  return ICON_003_BUILDING_TYPE_TO_CATEGORY[buildingTypeId];
}

/** Compact ICON-003 registry URL for World markers (never primary PNG). */
export function resolveWorldBuildingMarkerCompactUrl(buildingTypeId: string): string | null {
  const assetId = buildingTypeToIcon003CompactAssetId(buildingTypeId);
  if (assetId === null) {
    return null;
  }

  return resolveVisualAssetUrl(assetId, { preferWebp: false });
}

/** Marker layout rules for infrastructure grammars (presentation-only). */
export function resolveWorldBuildingMarkerVisualSpec(
  buildingTypeId: string,
  clusterSize = 1,
): WorldBuildingMarkerVisualSpec {
  const clusterScale = resolveWorldBuildingMarkerClusterScale(clusterSize);

  if (buildingTypeId === 'access_road') {
    return scaleSpec(38, 20, 46, 21, clusterScale);
  }

  if (
    isIcon003InfrastructureBuildingType(buildingTypeId) &&
    (buildingTypeId === 'port' || buildingTypeId === 'rail_terminal')
  ) {
    return scaleSpec(32, 26, 46, 21, clusterScale);
  }

  return scaleSpec(34, 34, 46, 21, clusterScale);
}
