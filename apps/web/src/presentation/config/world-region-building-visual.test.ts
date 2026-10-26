import { describe, expect, it } from 'vitest';
import {
  resolveWorldRegionBuildingAssetUrl,
  resolveWorldRegionBuildingVisualSpec,
} from './world-region-building-visual';

describe('world-region-building-visual', () => {
  it('maps the five Slice 2C starter types to distinct regional assets', () => {
    const headquarters = resolveWorldRegionBuildingVisualSpec('headquarters');
    const warehouse = resolveWorldRegionBuildingVisualSpec('warehouse');
    const substation = resolveWorldRegionBuildingVisualSpec('power_substation');
    const accessRoad = resolveWorldRegionBuildingVisualSpec('access_road');
    const sawmill = resolveWorldRegionBuildingVisualSpec('sawmill');

    expect(headquarters.assetUrl).toContain('headquarters.png');
    expect(warehouse.assetUrl).toContain('warehouse.png');
    expect(substation.assetUrl).toContain('substation.png');
    expect(accessRoad.assetUrl).toContain('access-road.png');
    expect(sawmill.assetUrl).toContain('sawmill.png');

    expect(new Set([headquarters.assetUrl, warehouse.assetUrl, substation.assetUrl, accessRoad.assetUrl, sawmill.assetUrl]).size).toBe(5);

    expect(warehouse.displayWidthPx).toBeGreaterThan(headquarters.displayWidthPx);
    expect(sawmill.displayWidthPx).toBeGreaterThan(warehouse.displayWidthPx * 0.9);
    expect(accessRoad.displayHeightPx).toBeLessThan(headquarters.displayHeightPx);
    expect(headquarters.displayWidthPx).toBeGreaterThanOrEqual(72);
  });

  it('uses restrained default for unknown types without compact circle art', () => {
    const unknown = resolveWorldRegionBuildingVisualSpec('unknown_future_type');
    expect(unknown.assetUrl).toMatch(/headquarters\.png$/);
    expect(resolveWorldRegionBuildingAssetUrl('unknown_future_type')).toBeNull();
  });

  it('anchors ground contact below visual center', () => {
    for (const typeId of ['headquarters', 'warehouse', 'power_substation', 'access_road', 'sawmill']) {
      const spec = resolveWorldRegionBuildingVisualSpec(typeId);
      expect(spec.anchorY).toBe(1);
      expect(spec.anchorX).toBe(0.5);
    }
  });
});
