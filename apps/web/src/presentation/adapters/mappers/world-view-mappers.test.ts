import { describe, expect, it } from 'vitest';
import type { RegionDto } from '@/presentation/adapters/api/query-client';
import { mapWorldInspectorViewData, mapWorldMapViewData } from '@/presentation/adapters/mappers/world-view-mappers';

const REGIONS: readonly RegionDto[] = Object.freeze([
  Object.freeze({
    id: 'region_001',
    name: 'Heartland',
    description: 'Starter region',
    worldId: 'world_001',
    biomeId: 'temperate',
    mapX: 0,
    mapY: 0,
    neighborRegionIds: Object.freeze(['region_002']),
    cityIds: Object.freeze(['city_001']),
  }),
  Object.freeze({
    id: 'region_002',
    name: 'North Coast',
    description: 'Coastal trade hub',
    worldId: 'world_001',
    biomeId: 'coastal',
    mapX: 1,
    mapY: 0,
    neighborRegionIds: Object.freeze(['region_001']),
    cityIds: Object.freeze([]),
  }),
]);

describe('world-view-mappers', () => {
  it('mapWorldMapViewData merges map placements with region catalog', () => {
    const viewData = mapWorldMapViewData(
      {
        id: 'map_001',
        name: 'Genesis Map',
        regions: [
          { regionId: 'region_001', x: 0, y: 0 },
          { regionId: 'region_002', x: 1, y: 0 },
        ],
        connections: [{ fromRegionId: 'region_001', toRegionId: 'region_002', distance: 12 }],
      },
      REGIONS,
    );

    expect(viewData.mapName).toBe('Genesis Map');
    expect(viewData.regions).toHaveLength(2);
    expect(viewData.regions[0]?.name).toBe('Heartland');
    expect(viewData.connections[0]?.distanceLabel).toBe('12');
    expect(viewData.columns).toBe(2);
  });

  it('mapWorldInspectorViewData builds overview sections without gameplay panels', () => {
    const inspector = mapWorldInspectorViewData({
      id: 'region_001',
      title: 'Heartland',
      description: 'Starter region',
      biomeId: 'temperate',
      resources: [{ label: 'wood', amountLabel: '100 (1,00×)' }],
      cities: [{ id: 'city_001', name: 'Capital', category: 'METROPOLIS' }],
    });

    expect(inspector.title).toBe('Heartland');
    expect(inspector.sections.map((section) => section.id)).toEqual([
      'overview',
      'cities',
      'resources',
    ]);
    expect(inspector.relatedItems?.[0]?.primary).toBe('Capital');
  });
});
