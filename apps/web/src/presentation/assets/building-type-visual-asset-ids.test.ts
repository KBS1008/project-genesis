import { describe, expect, it } from 'vitest';
import {
  buildingCategoryFallbackIconAssetId,
  buildingTypeToIcon003CompactAssetId,
  buildingTypeToIcon003PrimaryAssetId,
  ICON_003_BATCH_1_BUILDING_TYPE_IDS,
  ICON_003_BATCH_2_BUILDING_TYPE_IDS,
  ICON_003_BATCH_3_BUILDING_TYPE_IDS,
  ICON_003_PRODUCTION_BUILDING_TYPE_IDS,
  isIcon003Batch1BuildingType,
  isIcon003Batch2BuildingType,
  isIcon003Batch3BuildingType,
  isIcon003ProductionBuildingType,
} from '@/presentation/assets/building-type-visual-asset-ids';

describe('building-type-visual-asset-ids', () => {
  it('lists exactly eight batch-1 building types', () => {
    expect(ICON_003_BATCH_1_BUILDING_TYPE_IDS).toHaveLength(8);
  });

  it('lists batch-2 and batch-3 building types', () => {
    expect(ICON_003_BATCH_2_BUILDING_TYPE_IDS).toHaveLength(8);
    expect(ICON_003_BATCH_3_BUILDING_TYPE_IDS).toHaveLength(4);
    expect(ICON_003_PRODUCTION_BUILDING_TYPE_IDS).toHaveLength(20);
  });

  it('maps batch-1 buildings to ICON-003 primary and compact IDs', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('sawmill')).toBe('ICON-003-sawmill');
    expect(buildingTypeToIcon003CompactAssetId('sawmill')).toBe('ICON-003-sawmill-compact');
    expect(isIcon003Batch1BuildingType('sawmill')).toBe(true);
  });

  it('maps batch-2 buildings to ICON-003 primary and compact IDs', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('assembly_plant')).toBe('ICON-003-assembly_plant');
    expect(buildingTypeToIcon003CompactAssetId('university')).toBe('ICON-003-university-compact');
    expect(isIcon003Batch2BuildingType('assembly_plant')).toBe(true);
    expect(isIcon003ProductionBuildingType('power_substation')).toBe(true);
  });

  it('maps batch-3 buildings to ICON-003 primary and compact IDs', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('maintenance_facility')).toBe('ICON-003-maintenance_facility');
    expect(buildingTypeToIcon003CompactAssetId('training_center')).toBe('ICON-003-training_center-compact');
    expect(isIcon003Batch3BuildingType('recycling_facility')).toBe(true);
  });

  it('returns null for special infrastructure building types', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('port')).toBeNull();
    expect(buildingTypeToIcon003CompactAssetId('access_road')).toBeNull();
    expect(isIcon003ProductionBuildingType('rail_terminal')).toBe(false);
  });

  it('falls back to ICON-002 category assets', () => {
    expect(buildingCategoryFallbackIconAssetId('PRODUCTION')).toBe('ICON-002-production');
    expect(buildingCategoryFallbackIconAssetId('STORAGE')).toBe('ICON-002-storage');
  });
});
