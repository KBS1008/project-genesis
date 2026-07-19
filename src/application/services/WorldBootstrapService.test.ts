import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import { DEFAULT_MAP_ID, DEFAULT_REGION_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import { createWorldId } from '../../domain/world/WorldId.js';
import { createWorldMapId } from '../../domain/world/WorldMapId.js';
import { InMemoryCityRepository } from '../../infrastructure/persistence/InMemoryCityRepository.js';
import { InMemoryRegionRepository } from '../../infrastructure/persistence/InMemoryRegionRepository.js';
import { InMemoryWorldMapRepository } from '../../infrastructure/persistence/InMemoryWorldMapRepository.js';
import { InMemoryWorldRepository } from '../../infrastructure/persistence/InMemoryWorldRepository.js';
import { WorldBootstrapService } from './WorldBootstrapService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function createService() {
  const worldRepository = new InMemoryWorldRepository();
  const regionRepository = new InMemoryRegionRepository();
  const cityRepository = new InMemoryCityRepository();
  const worldMapRepository = new InMemoryWorldMapRepository();

  return {
    worldRepository,
    regionRepository,
    cityRepository,
    worldMapRepository,
    service: new WorldBootstrapService({
      worldRepository,
      regionRepository,
      cityRepository,
      worldMapRepository,
    }),
  };
}

describe('WorldBootstrapService', () => {
  it('bootstraps worlds, regions, cities and maps from official content', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { worldRepository, regionRepository, cityRepository, worldMapRepository, service } =
      createService();

    const bootstrapResult = service.bootstrap(contentResult.value);

    expect(bootstrapResult.ok).toBe(true);

    const defaultWorldId = createWorldId(DEFAULT_WORLD_ID);
    const defaultRegionId = createRegionId(DEFAULT_REGION_ID);
    const defaultMapId = createWorldMapId(DEFAULT_MAP_ID);

    expect(defaultWorldId.ok).toBe(true);
    expect(defaultRegionId.ok).toBe(true);
    expect(defaultMapId.ok).toBe(true);

    if (defaultWorldId.ok && defaultRegionId.ok && defaultMapId.ok) {
      const world = worldRepository.findById(defaultWorldId.value);
      const region = regionRepository.findById(defaultRegionId.value);
      const worldMap = worldMapRepository.findById(defaultMapId.value);

      expect(world).toBeDefined();
      expect(region).toBeDefined();
      expect(worldMap).toBeDefined();
      expect(world?.containsRegion(defaultRegionId.value)).toBe(true);
      expect(regionRepository.findByWorldId(defaultWorldId.value)).toHaveLength(3);
      expect(regionRepository.findAll().map((entry) => entry.getId().value)).toEqual([
        'region_default',
        'region_east',
        'region_north',
      ]);
      expect(cityRepository.findAll().map((entry) => entry.getId().value)).toEqual([
        'city_industrial_hub',
        'city_port_harbor',
      ]);
      expect(worldMap?.getConnections()).toHaveLength(3);
    }
  });

  it('rejects invalid world membership', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const brokenContent: typeof contentResult.value = {
      ...contentResult.value,
      worlds: {
        ...contentResult.value.worlds,
        getAll: () => [
          {
            id: 'world_default',
            name: 'Broken World',
            regionIds: ['region_missing'],
            enabled: true,
            version: 1,
          },
        ],
      },
    };

    const { service } = createService();
    const bootstrapResult = service.bootstrap(brokenContent);

    expect(bootstrapResult.ok).toBe(false);
  });

  it('is idempotent when repositories are already seeded', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { worldRepository, regionRepository, cityRepository, worldMapRepository, service } =
      createService();

    const firstBootstrap = service.bootstrap(contentResult.value);
    const secondBootstrap = service.bootstrap(contentResult.value);

    expect(firstBootstrap.ok).toBe(true);
    expect(secondBootstrap.ok).toBe(true);
    expect(worldRepository.findAll()).toHaveLength(1);
    expect(regionRepository.findAll()).toHaveLength(3);
    expect(cityRepository.findAll()).toHaveLength(2);
    expect(worldMapRepository.findAll()).toHaveLength(1);
  });
});
