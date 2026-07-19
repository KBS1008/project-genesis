import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { DEFAULT_MAP_ID } from '../../domain/world/WorldConstants.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { GetWorldMapQueryHandler } from './GetWorldMapQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('GetWorldMapQueryHandler', () => {
  it('returns the default world map graph', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { worldMapRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetWorldMapQueryHandler({ worldMapRepository });
    const result = handler.execute({ mapId: DEFAULT_MAP_ID });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.id).toBe(DEFAULT_MAP_ID);
      expect(result.value.regions.map((placement) => placement.regionId)).toEqual([
        'region_default',
        'region_east',
        'region_north',
      ]);
      expect(result.value.connections).toHaveLength(3);
    }
  });

  it('rejects unknown map ids', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { worldMapRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetWorldMapQueryHandler({ worldMapRepository });
    const result = handler.execute({ mapId: 'map_missing' });

    expect(result.ok).toBe(false);
  });
});
