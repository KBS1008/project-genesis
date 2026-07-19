import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { GetRegionDetailsQueryHandler } from './GetRegionDetailsQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('GetRegionDetailsQueryHandler', () => {
  it('returns region metadata, resources and cities', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository, cityRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetRegionDetailsQueryHandler({ regionRepository, cityRepository });
    const result = handler.execute({ regionId: 'region_default' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.region.id).toBe('region_default');
      expect(result.value.regionalResources.length).toBeGreaterThan(0);
      expect(result.value.cities.map((city) => city.id)).toContain('city_port_harbor');
    }
  });

  it('rejects unknown region ids', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository, cityRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetRegionDetailsQueryHandler({ regionRepository, cityRepository });
    const result = handler.execute({ regionId: 'region_missing' });

    expect(result.ok).toBe(false);
  });
});
