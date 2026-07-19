import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { DEFAULT_MAP_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import { GetWorldOverviewQueryHandler } from './GetWorldOverviewQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('GetWorldOverviewQueryHandler', () => {
  it('returns bootstrapped world overview with default map id', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { worldRepository, regionRepository, cityRepository, worldMapRepository } =
      bootstrapWorldFromContent(contentResult.value);
    const handler = new GetWorldOverviewQueryHandler({
      worldRepository,
      cityRepository,
      worldMapRepository,
    });
    const result = handler.execute();

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.activeWorldId).toBe(DEFAULT_WORLD_ID);
      expect(result.value.regionCount).toBe(regionRepository.findAll().length);
      expect(result.value.regionIds).toContain('region_default');
      expect(result.value.defaultMapId).toBe(DEFAULT_MAP_ID);
      expect(result.value.cityCount).toBeGreaterThan(0);
    }
  });
});
