import { describe, expect, it } from 'vitest';
import {
  buildingCategoryFallbackIconAssetId,
  buildingTypeToIcon003CompactAssetId,
  buildingTypeToIcon003PrimaryAssetId,
  ICON_003_BATCH_1_BUILDING_TYPE_IDS,
  isIcon003Batch1BuildingType,
} from '@/presentation/assets/building-type-visual-asset-ids';

describe('building-type-visual-asset-ids', () => {
  it('lists exactly eight batch-1 building types', () => {
    expect(ICON_003_BATCH_1_BUILDING_TYPE_IDS).toHaveLength(8);
  });

  it('maps batch-1 buildings to ICON-003 primary and compact IDs', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('sawmill')).toBe('ICON-003-sawmill');
    expect(buildingTypeToIcon003CompactAssetId('sawmill')).toBe('ICON-003-sawmill-compact');
    expect(isIcon003Batch1BuildingType('sawmill')).toBe(true);
  });

  it('returns null for uncovered building types', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('port')).toBeNull();
    expect(buildingTypeToIcon003CompactAssetId('university')).toBeNull();
    expect(isIcon003Batch1BuildingType('port')).toBe(false);
  });

  it('falls back to ICON-002 category assets', () => {
    expect(buildingCategoryFallbackIconAssetId('PRODUCTION')).toBe('ICON-002-production');
    expect(buildingCategoryFallbackIconAssetId('STORAGE')).toBe('ICON-002-storage');
  });
});
