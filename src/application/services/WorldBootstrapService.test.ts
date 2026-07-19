import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import { DEFAULT_REGION_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import { createWorldId } from '../../domain/world/WorldId.js';
import { InMemoryRegionRepository } from '../../infrastructure/persistence/InMemoryRegionRepository.js';
import { InMemoryWorldRepository } from '../../infrastructure/persistence/InMemoryWorldRepository.js';
import { WorldBootstrapService } from './WorldBootstrapService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('WorldBootstrapService', () => {
  it('bootstraps worlds and regions from official content', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const worldRepository = new InMemoryWorldRepository();
    const regionRepository = new InMemoryRegionRepository();
    const service = new WorldBootstrapService({ worldRepository, regionRepository });

    const bootstrapResult = service.bootstrap(contentResult.value);

    expect(bootstrapResult.ok).toBe(true);

    const defaultWorldId = createWorldId(DEFAULT_WORLD_ID);
    const defaultRegionId = createRegionId(DEFAULT_REGION_ID);

    expect(defaultWorldId.ok).toBe(true);
    expect(defaultRegionId.ok).toBe(true);

    if (defaultWorldId.ok && defaultRegionId.ok) {
      const world = worldRepository.findById(defaultWorldId.value);
      const region = regionRepository.findById(defaultRegionId.value);

      expect(world).toBeDefined();
      expect(region).toBeDefined();
      expect(world?.containsRegion(defaultRegionId.value)).toBe(true);
      expect(regionRepository.findByWorldId(defaultWorldId.value)).toHaveLength(3);
      expect(regionRepository.findAll().map((entry) => entry.getId().value)).toEqual([
        'region_default',
        'region_east',
        'region_north',
      ]);
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

    const worldRepository = new InMemoryWorldRepository();
    const regionRepository = new InMemoryRegionRepository();
    const service = new WorldBootstrapService({ worldRepository, regionRepository });

    const bootstrapResult = service.bootstrap(brokenContent);

    expect(bootstrapResult.ok).toBe(false);
  });

  it('is idempotent when repositories are already seeded', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const worldRepository = new InMemoryWorldRepository();
    const regionRepository = new InMemoryRegionRepository();
    const service = new WorldBootstrapService({ worldRepository, regionRepository });

    const firstBootstrap = service.bootstrap(contentResult.value);
    const secondBootstrap = service.bootstrap(contentResult.value);

    expect(firstBootstrap.ok).toBe(true);
    expect(secondBootstrap.ok).toBe(true);
    expect(worldRepository.findAll()).toHaveLength(1);
    expect(regionRepository.findAll()).toHaveLength(3);
  });
});
