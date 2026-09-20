import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ICON_003_PRODUCTION_BUILDING_TYPE_IDS,
  buildingTypeToIcon003CompactAssetId,
} from '@/presentation/assets/building-type-visual-asset-ids';
import { getVisualAssetEntry } from '@/presentation/assets/visual-asset-registry';
import {
  resolveIcon003BuildingCategory,
  resolveWorldBuildingMarkerCompactUrl,
  resolveWorldBuildingMarkerVisualSpec,
  WORLD_BUILDING_MARKER_GLYPH_PX,
} from '@/presentation/components/world/world-building-marker-visual';

const projectRoot = path.resolve(import.meta.dirname, '../../../../../..');
const publicRoot = path.join(projectRoot, 'apps/web/public');

describe('world-building-marker-visual', () => {
  it('resolves compact registry paths for every ICON-003 production building type', () => {
    expect(ICON_003_PRODUCTION_BUILDING_TYPE_IDS.length).toBe(23);

    for (const buildingTypeId of ICON_003_PRODUCTION_BUILDING_TYPE_IDS) {
      const assetId = buildingTypeToIcon003CompactAssetId(buildingTypeId);
      expect(assetId, buildingTypeId).toBe(`ICON-003-${buildingTypeId}-compact`);

      const entry = getVisualAssetEntry(assetId!);
      expect(entry, buildingTypeId).not.toBeNull();
      expect(entry?.format).toBe('svg');
      expect(entry?.path, buildingTypeId).toMatch(/^\/assets\/buildings\//);

      const publicPath = path.join(publicRoot, entry!.path!.replace(/^\//, ''));
      expect(existsSync(publicPath), publicPath).toBe(true);

      expect(resolveWorldBuildingMarkerCompactUrl(buildingTypeId)).toBe(entry!.path);
      expect(resolveIcon003BuildingCategory(buildingTypeId)).toBeTruthy();
    }
  });

  it('uses grammar-aware presentation specs without per-ID switches in consumers', () => {
    expect(resolveWorldBuildingMarkerVisualSpec('access_road').width).toBeGreaterThan(
      resolveWorldBuildingMarkerVisualSpec('sawmill').width,
    );
    expect(resolveWorldBuildingMarkerVisualSpec('port').height).toBe(
      resolveWorldBuildingMarkerVisualSpec('rail_terminal').height,
    );
    expect(WORLD_BUILDING_MARKER_GLYPH_PX).toBe(34);
    expect(resolveWorldBuildingMarkerVisualSpec('sawmill', 5).width).toBeLessThan(
      resolveWorldBuildingMarkerVisualSpec('sawmill', 4).width,
    );
  });

  it('returns null compact URL for unknown building types', () => {
    expect(resolveWorldBuildingMarkerCompactUrl('unknown_building_xyz')).toBeNull();
    expect(resolveIcon003BuildingCategory('unknown_building_xyz')).toBeNull();
  });
});
