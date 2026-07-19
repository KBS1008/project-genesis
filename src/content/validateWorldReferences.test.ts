import { BiomeDefinition } from './biome/BiomeDefinition.js';
import { BiomeRegistry } from './biome/BiomeRegistry.js';
import { CityDefinition, CityCategory } from './city/CityDefinition.js';
import { CityRegistry } from './city/CityRegistry.js';
import { MapDefinition } from './map/MapDefinition.js';
import { MapRegistry } from './map/MapRegistry.js';
import { RegionDefinition } from './region/RegionDefinition.js';
import { RegionRegistry } from './region/RegionRegistry.js';
import { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';
import { WorldDefinition } from './world/WorldDefinition.js';
import { WorldRegistry } from './world/WorldRegistry.js';
import { validateWorldReferences } from './validateWorldReferences.js';

function createValidWorldGraph(): {
  worlds: WorldRegistry;
  regions: RegionRegistry;
  biomes: BiomeRegistry;
  maps: MapRegistry;
  cities: CityRegistry;
  resourceTypes: ResourceTypeRegistry;
} {
  const worlds = new WorldRegistry();
  const regions = new RegionRegistry();
  const biomes = new BiomeRegistry();
  const maps = new MapRegistry();
  const cities = new CityRegistry();
  const resourceTypes = new ResourceTypeRegistry();

  void biomes.register(
    new BiomeDefinition({
      id: 'biome_test',
      name: 'Test Biome',
      description: 'Test biome.',
      category: 'TEST',
      constructionCostModifier: 1,
      transportDurationModifier: 1,
      enabled: true,
      version: 1,
    }),
  );

  void cities.register(
    new CityDefinition({
      id: 'city_test',
      name: 'Test City',
      regionId: 'region_test',
      category: CityCategory.MARKET_HUB,
      enabled: true,
      version: 1,
    }),
  );

  void regions.register(
    new RegionDefinition({
      id: 'region_test',
      name: 'Test Region',
      description: 'Test region.',
      worldId: 'world_test',
      biomeId: 'biome_test',
      mapPosition: { x: 0, y: 0 },
      neighborRegionIds: [],
      cityIds: ['city_test'],
      regionalResources: [],
      enabled: true,
      version: 1,
    }),
  );

  void worlds.register(
    new WorldDefinition({
      id: 'world_test',
      name: 'Test World',
      regionIds: ['region_test'],
      enabled: true,
      version: 1,
    }),
  );

  void maps.register(
    new MapDefinition({
      id: 'map_test',
      name: 'Test Map',
      regions: [{ regionId: 'region_test', x: 0, y: 0 }],
      connections: [],
      enabled: true,
      version: 1,
    }),
  );

  return { worlds, regions, biomes, maps, cities, resourceTypes };
}

describe('validateWorldReferences', () => {
  it('accepts a consistent world graph', () => {
    const graph = createValidWorldGraph();
    const result = validateWorldReferences(
      graph.worlds,
      graph.regions,
      graph.biomes,
      graph.maps,
      graph.cities,
      graph.resourceTypes,
    );

    expect(result.ok).toBe(true);
  });

  it('rejects unknown region references on worlds', () => {
    const graph = createValidWorldGraph();
    void graph.worlds.register(
      new WorldDefinition({
        id: 'world_bad',
        name: 'Bad World',
        regionIds: ['region_missing'],
        enabled: true,
        version: 1,
      }),
    );

    const result = validateWorldReferences(
      graph.worlds,
      graph.regions,
      graph.biomes,
      graph.maps,
      graph.cities,
      graph.resourceTypes,
    );

    expect(result.ok).toBe(false);
  });

  it('rejects cities not listed on their region', () => {
    const graph = createValidWorldGraph();
    void graph.cities.register(
      new CityDefinition({
        id: 'city_orphan',
        name: 'Orphan City',
        regionId: 'region_test',
        category: CityCategory.INDUSTRIAL,
        enabled: true,
        version: 1,
      }),
    );

    const result = validateWorldReferences(
      graph.worlds,
      graph.regions,
      graph.biomes,
      graph.maps,
      graph.cities,
      graph.resourceTypes,
    );

    expect(result.ok).toBe(false);
  });
});
