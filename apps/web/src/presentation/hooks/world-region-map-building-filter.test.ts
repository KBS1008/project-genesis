import { describe, expect, it } from 'vitest';
import { filterBuildingMarkersForRegionFocus } from '@/presentation/hooks/world-map-view-mode';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';

function marker(
  id: string,
  regionId: string,
  domainX: number,
  domainY: number,
): WorldBuildingMarkerViewData {
  return Object.freeze({
    id,
    buildingTypeId: 'warehouse',
    regionId,
    label: id,
    statusLabel: 'ACTIVE',
    clusterSize: 1,
    domainX,
    domainY,
    x: domainX,
    y: domainY,
  });
}

describe('region map building filter', () => {
  const markers = [
    marker('building_001', 'region_default', 12, 12),
    marker('building_east', 'region_east', 20, 20),
  ];

  it('returns only buildings for the focused region', () => {
    expect(
      filterBuildingMarkersForRegionFocus(markers, 'region_focus', 'region_default'),
    ).toEqual([markers[0]]);
  });

  it('preserves domain coordinates and ids', () => {
    const filtered = filterBuildingMarkersForRegionFocus(
      markers,
      'region_focus',
      'region_default',
    )[0]!;
    expect(filtered.domainX).toBe(12);
    expect(filtered.domainY).toBe(12);
    expect(filtered.id).toBe('building_001');
  });
});
