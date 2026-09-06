import { describe, expect, it } from 'vitest';
import {
  buildingCategoryToIconAssetId,
  resolveBuildingCategoryIconAssetId,
  resolveBuildingCategoryIconSvgMarkup,
} from '@/presentation/assets/building-category-icon-asset-ids';
import {
  BUILDING_CATEGORY_TO_ICON_002_ASSET_ID,
  ICON_002_CERTIFIED_SVG_BY_ASSET_ID,
} from '@/presentation/assets/icon-002-certified-svg-sources';

describe('building-category-icon-asset-ids', () => {
  it('maps all six BuildingCategory values to ICON-002 asset IDs', () => {
    expect(buildingCategoryToIconAssetId('PRODUCTION')).toBe('ICON-002-production');
    expect(buildingCategoryToIconAssetId('ENERGY')).toBe('ICON-002-energy');
    expect(buildingCategoryToIconAssetId('STORAGE')).toBe('ICON-002-storage');
    expect(buildingCategoryToIconAssetId('INFRASTRUCTURE')).toBe('ICON-002-infrastructure');
    expect(buildingCategoryToIconAssetId('ADMINISTRATION')).toBe('ICON-002-administration');
    expect(buildingCategoryToIconAssetId('RESEARCH')).toBe('ICON-002-research');
    expect(Object.keys(BUILDING_CATEGORY_TO_ICON_002_ASSET_ID)).toHaveLength(6);
  });

  it('returns null for unknown or invalid categories without fallback substitution', () => {
    expect(buildingCategoryToIconAssetId('UNKNOWN')).toBeNull();
    expect(buildingCategoryToIconAssetId('')).toBeNull();
    expect(buildingCategoryToIconAssetId('sawmill')).toBeNull();
    expect(resolveBuildingCategoryIconAssetId('UNKNOWN')).toBeNull();
    expect(resolveBuildingCategoryIconSvgMarkup('UNKNOWN')).toBeNull();
  });

  it('resolves certified registry-backed asset IDs for known categories', () => {
    for (const category of Object.keys(BUILDING_CATEGORY_TO_ICON_002_ASSET_ID)) {
      expect(resolveBuildingCategoryIconAssetId(category)).toBe(
        BUILDING_CATEGORY_TO_ICON_002_ASSET_ID[
          category as keyof typeof BUILDING_CATEGORY_TO_ICON_002_ASSET_ID
        ],
      );
    }
  });

  it('returns inline SVG markup for known categories', () => {
    expect(resolveBuildingCategoryIconSvgMarkup('PRODUCTION')).toBe(
      ICON_002_CERTIFIED_SVG_BY_ASSET_ID['ICON-002-production'],
    );
    expect(resolveBuildingCategoryIconSvgMarkup('RESEARCH')).toContain('stroke="currentColor"');
  });
});
