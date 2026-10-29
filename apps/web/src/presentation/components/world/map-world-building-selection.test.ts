import { describe, expect, it } from 'vitest';
import { buildWorldMapBuildingInspectorDetail } from '@/presentation/components/world/map-world-building-selection';
import type { EntityDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';

const marker: WorldBuildingMarkerViewData = Object.freeze({
  id: 'building_005',
  buildingTypeId: 'sawmill',
  regionId: 'region_default',
  label: 'Sawmill A',
  statusLabel: 'ACTIVE',
  clusterSize: 1,
  domainX: 26,
  domainY: 20,
  x: 26,
  y: 20,
});

const detail: EntityDetailViewData = Object.freeze({
  title: 'Sawmill',
  subtitle: 'Produktion',
  entries: Object.freeze([['Typ', 'Sägewerk']] as const),
});

describe('buildWorldMapBuildingInspectorDetail', () => {
  it('merges marker coordinates with company detail', () => {
    const merged = buildWorldMapBuildingInspectorDetail(
      'building_005',
      detail,
      marker,
      'Central Basin',
    );

    expect(merged?.title).toBe('Sawmill');
    expect(merged?.entries.some(([label]) => label === 'Gebäude-ID')).toBe(true);
    expect(merged?.entries.some(([, value]) => value === '26, 20')).toBe(true);
    expect(merged?.entries.some(([, value]) => value === 'Central Basin')).toBe(true);
  });

  it('returns null when no detail and no marker', () => {
    expect(buildWorldMapBuildingInspectorDetail('building_x', undefined, undefined, null)).toBeNull();
  });
});
