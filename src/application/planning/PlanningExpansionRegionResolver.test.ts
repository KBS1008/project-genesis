import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import { InMemoryCityRepository } from '../../infrastructure/persistence/InMemoryCityRepository.js';
import { InMemoryRegionRepository } from '../../infrastructure/persistence/InMemoryRegionRepository.js';
import { InMemoryWorldMapRepository } from '../../infrastructure/persistence/InMemoryWorldMapRepository.js';
import { InMemoryWorldRepository } from '../../infrastructure/persistence/InMemoryWorldRepository.js';
import { WorldBootstrapService } from '../services/WorldBootstrapService.js';
import { resolveExpansionTargetRegion } from './PlanningExpansionRegionResolver.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('resolveExpansionTargetRegion', () => {
  it('returns a connected region that is not yet occupied', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    if (!contentResult.ok) {
      throw new Error(contentResult.error.message);
    }

    const worldRepository = new InMemoryWorldRepository();
    const regionRepository = new InMemoryRegionRepository();
    const cityRepository = new InMemoryCityRepository();
    const worldMapRepository = new InMemoryWorldMapRepository();
    const worldBootstrap = new WorldBootstrapService({
      worldRepository,
      regionRepository,
      cityRepository,
      worldMapRepository,
    });
    const seedResult = worldBootstrap.bootstrap(contentResult.value);

    expect(seedResult.ok).toBe(true);

    const targetRegionId = resolveExpansionTargetRegion({
      primaryRegionId: DEFAULT_REGION_ID,
      occupiedRegionIds: [DEFAULT_REGION_ID],
      worldMapRepository,
    });

    expect(targetRegionId).toBe('region_east');
  });
});
