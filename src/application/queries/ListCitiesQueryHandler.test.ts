import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { ListCitiesQueryHandler } from './ListCitiesQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('ListCitiesQueryHandler', () => {
  it('returns all bootstrapped cities in deterministic order', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { cityRepository, regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new ListCitiesQueryHandler({ cityRepository, regionRepository });
    const result = handler.execute();

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.map((city) => city.id)).toEqual(['city_industrial_hub', 'city_port_harbor']);
    }
  });

  it('filters cities by region and rejects unknown regions', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { cityRepository, regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new ListCitiesQueryHandler({ cityRepository, regionRepository });

    const filteredResult = handler.execute({ regionId: 'region_default' });

    expect(filteredResult.ok).toBe(true);

    if (filteredResult.ok) {
      expect(filteredResult.value).toHaveLength(1);
      expect(filteredResult.value[0]?.id).toBe('city_port_harbor');
    }

    const missingRegionResult = handler.execute({ regionId: 'region_missing' });

    expect(missingRegionResult.ok).toBe(false);
  });
});
