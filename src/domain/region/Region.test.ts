import { Region } from './Region.js';

describe('Region', () => {
  it('creates a region with deterministic neighbor, city and resource ordering', () => {
    const result = Region.fromContent({
      id: 'region_default',
      name: 'Central Basin',
      description: 'Starter region.',
      worldId: 'world_default',
      biomeId: 'biome_temperate_forest',
      mapPosition: { x: 0, y: 0 },
      neighborRegionIds: ['region_north', 'region_east'],
      cityIds: ['city_port_harbor'],
      regionalResources: [
        { resourceTypeId: 'wood', available: true, extractionModifier: 1.0 },
        { resourceTypeId: 'planks', available: true, extractionModifier: 1.0 },
      ],
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getNeighborRegionIds().map((id) => id.value)).toEqual([
        'region_east',
        'region_north',
      ]);
      expect(result.value.getCityIds().map((id) => id.value)).toEqual(['city_port_harbor']);
      expect(result.value.getRegionalResources().map((entry) => entry.resourceTypeId)).toEqual([
        'planks',
        'wood',
      ]);
      expect(result.value.getRegionalResource('wood')?.available).toBe(true);
    }
  });

  it('rejects invalid region ids', () => {
    const result = Region.fromContent({
      id: '',
      name: 'Invalid',
      description: 'Invalid region.',
      worldId: 'world_default',
      biomeId: 'biome_temperate_forest',
      mapPosition: { x: 0, y: 0 },
      neighborRegionIds: [],
      cityIds: [],
      regionalResources: [],
    });

    expect(result.ok).toBe(false);
  });
});
