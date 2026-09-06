import {
  BUILDING_CATEGORY_TO_ICON_002_ASSET_ID,
  ICON_002_CERTIFIED_SVG_BY_ASSET_ID,
  type BuildingCategoryIconCategory,
  type Icon002BuildingCategoryAssetId,
} from '@/presentation/assets/icon-002-certified-svg-sources';
import { getVisualAssetEntry } from '@/presentation/assets/visual-asset-registry';

/** Maps a BuildingCategory enum string to the ICON-002 registry asset ID. */
export function buildingCategoryToIconAssetId(category: string): Icon002BuildingCategoryAssetId | null {
  if (!(category in BUILDING_CATEGORY_TO_ICON_002_ASSET_ID)) {
    return null;
  }

  return BUILDING_CATEGORY_TO_ICON_002_ASSET_ID[category as BuildingCategoryIconCategory];
}

/** Returns registry asset ID when a certified ICON-002 runtime entry exists. */
export function resolveBuildingCategoryIconAssetId(category: string): Icon002BuildingCategoryAssetId | null {
  const assetId = buildingCategoryToIconAssetId(category);

  if (assetId === null) {
    return null;
  }

  const entry = getVisualAssetEntry(assetId);

  if (entry === null || entry.type !== 'runtime' || entry.path === null || entry.format !== 'svg') {
    return null;
  }

  return assetId;
}

/** Returns inline SVG markup for currentColor runtime rendering. */
export function resolveBuildingCategoryIconSvgMarkup(category: string): string | null {
  const assetId = buildingCategoryToIconAssetId(category);

  if (assetId === null) {
    return null;
  }

  return ICON_002_CERTIFIED_SVG_BY_ASSET_ID[assetId] ?? null;
}
