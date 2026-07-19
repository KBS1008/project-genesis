import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { ListRegionsQueryHandler } from './ListRegionsQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('ListRegionsQueryHandler', () => {
  it('returns bootstrapped regions in deterministic order', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new ListRegionsQueryHandler({ regionRepository });
    const result = handler.execute();

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.map((region) => region.id)).toEqual([
        'region_default',
        'region_east',
        'region_north',
      ]);
      expect(result.value[0]?.cityIds).toContain('city_port_harbor');
    }
  });
});
