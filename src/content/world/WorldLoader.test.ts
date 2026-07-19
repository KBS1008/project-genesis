import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WorldLoader } from './WorldLoader.js';
import { WorldRegistry } from './WorldRegistry.js';
import { validateWorldDefinition } from './WorldValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.resolve(testDirectory, '../../../tests/fixtures/worlds');
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/worlds');

describe('WorldLoader', () => {
  const loader = new WorldLoader();

  it('loads valid world fixtures into a registry', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(1);
      expect(result.value.has('world_fixture')).toBe(true);
    }
  });

  it('loads official game content worlds', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.has('world_default')).toBe(true);
    }
  });

  it('rejects duplicate world ids across files', async () => {
    const registry = new WorldRegistry();
    const loadResult = await loader.loadFile(path.join(fixturesDirectory, 'world_fixture.yaml'));

    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      const firstRegister = registry.register(loadResult.value);
      const secondRegister = registry.register(loadResult.value);

      expect(firstRegister.ok).toBe(true);
      expect(secondRegister.ok).toBe(false);
    }
  });

  it('rejects invalid global ids', () => {
    const result = validateWorldDefinition({
      id: 'INVALID-ID',
      name: 'Invalid',
      regionIds: [],
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });
});
