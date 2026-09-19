import { describe, expect, it } from 'vitest';
import {
  buildingCategoryFallbackIconAssetId,
  buildingTypeToIcon003CompactAssetId,
  buildingTypeToIcon003PrimaryAssetId,
  ICON_003_BATCH_1_BUILDING_TYPE_IDS,
  ICON_003_BATCH_2_BUILDING_TYPE_IDS,
  ICON_003_BATCH_3_BUILDING_TYPE_IDS,
  ICON_003_INFRASTRUCTURE_BUILDING_TYPE_IDS,
  ICON_003_PRODUCTION_BUILDING_TYPE_IDS,
  isIcon003Batch1BuildingType,
  isIcon003Batch2BuildingType,
  isIcon003Batch3BuildingType,
  isIcon003InfrastructureBuildingType,
  isIcon003ProductionBuildingType,
} from '@/presentation/assets/building-type-visual-asset-ids';

describe('building-type-visual-asset-ids', () => {
  it('lists exactly eight batch-1 building types', () => {
    expect(ICON_003_BATCH_1_BUILDING_TYPE_IDS).toHaveLength(8);
  });

  it('lists batch-2, batch-3, and infrastructure building types', () => {
    expect(ICON_003_BATCH_2_BUILDING_TYPE_IDS).toHaveLength(8);
    expect(ICON_003_BATCH_3_BUILDING_TYPE_IDS).toHaveLength(4);
    expect(ICON_003_INFRASTRUCTURE_BUILDING_TYPE_IDS).toHaveLength(3);
    expect(ICON_003_PRODUCTION_BUILDING_TYPE_IDS).toHaveLength(23);
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

  it('maps infrastructure buildings to ICON-003 primary and compact IDs', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('access_road')).toBe('ICON-003-access_road');
    expect(buildingTypeToIcon003CompactAssetId('port')).toBe('ICON-003-port-compact');
    expect(buildingTypeToIcon003PrimaryAssetId('rail_terminal')).toBe('ICON-003-rail_terminal');
    expect(isIcon003InfrastructureBuildingType('access_road')).toBe(true);
    expect(isIcon003ProductionBuildingType('port')).toBe(true);
  });

  it('resolves all 23 production building types to primary and compact ICON-003 IDs', () => {
    for (const buildingTypeId of ICON_003_PRODUCTION_BUILDING_TYPE_IDS) {
      expect(buildingTypeToIcon003PrimaryAssetId(buildingTypeId)).toBe(`ICON-003-${buildingTypeId}`);
      expect(buildingTypeToIcon003CompactAssetId(buildingTypeId)).toBe(`ICON-003-${buildingTypeId}-compact`);
    }
  });

  it('returns null for unknown building types', () => {
    expect(buildingTypeToIcon003PrimaryAssetId('unknown_building')).toBeNull();
    expect(buildingTypeToIcon003CompactAssetId('unknown_building')).toBeNull();
    expect(isIcon003ProductionBuildingType('unknown_building')).toBe(false);
  });

  it('falls back to ICON-002 category assets', () => {
    expect(buildingCategoryFallbackIconAssetId('PRODUCTION')).toBe('ICON-002-production');
    expect(buildingCategoryFallbackIconAssetId('STORAGE')).toBe('ICON-002-storage');
  });
});
