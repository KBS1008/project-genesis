import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { GetRegionalResourcesQueryHandler } from './GetRegionalResourcesQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('GetRegionalResourcesQueryHandler', () => {
  it('returns regional resources in deterministic order', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetRegionalResourcesQueryHandler({ regionRepository });
    const result = handler.execute({ regionId: 'region_default' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.map((entry) => entry.resourceTypeId)).toEqual(['planks', 'wood']);
      expect(result.value[1]?.available).toBe(true);
      expect(result.value[1]?.extractionModifier).toBe(1.0);
    }
  });

  it('returns region-specific resource profiles', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetRegionalResourcesQueryHandler({ regionRepository });
    const result = handler.execute({ regionId: 'region_east' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.map((entry) => entry.resourceTypeId)).toEqual(['iron_ore', 'steel']);
      expect(result.value[0]?.extractionModifier).toBe(1.2);
    }
  });

  it('rejects unknown region ids', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const handler = new GetRegionalResourcesQueryHandler({ regionRepository });
    const result = handler.execute({ regionId: 'region_missing' });

    expect(result.ok).toBe(false);
  });
});
