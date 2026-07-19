import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../../content/validateGameContent.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import { resolveBuildingRegionId } from './BuildingRegionPlacement.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('BuildingRegionPlacement', () => {
  it('resolves the default region when none is provided', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const result = resolveBuildingRegionId(regionRepository);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.value).toBe(DEFAULT_REGION_ID);
    }
  });

  it('rejects unknown regions', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    expect(contentResult.ok).toBe(true);

    if (!contentResult.ok) {
      return;
    }

    const { regionRepository } = bootstrapWorldFromContent(contentResult.value);
    const result = resolveBuildingRegionId(regionRepository, 'region_missing');

    expect(result.ok).toBe(false);
  });
});
