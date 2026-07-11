import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ResourceTypeLoader } from './ResourceTypeLoader.js';
import { ResourceTypeRegistry } from './ResourceTypeRegistry.js';
import { validateResourceTypeDefinition } from './ResourceTypeValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.resolve(testDirectory, '../../../tests/fixtures/resources');
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/resources');

describe('ResourceTypeLoader', () => {
  const loader = new ResourceTypeLoader();

  it('loads valid resource fixtures into a registry', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(3);
      expect(result.value.has('wood')).toBe(true);
      expect(result.value.has('iron_ore')).toBe(true);
      expect(result.value.has('planks')).toBe(true);

      const wood = result.value.get('wood');
      expect(wood?.name).toBe('Holz');
      expect(wood?.category).toBe('PRIMARY_RESOURCE');
    }
  });

  it('loads official game content resources', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns resources in deterministic order', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getAll().map((resource) => resource.id)).toEqual([
        'iron_ore',
        'planks',
        'wood',
      ]);
    }
  });

  it('rejects duplicate resource ids across files', async () => {
    const registry = new ResourceTypeRegistry();
    const woodResult = await loader.loadFile(path.join(fixturesDirectory, 'wood.yaml'));

    expect(woodResult.ok).toBe(true);

    if (woodResult.ok) {
      const firstRegister = registry.register(woodResult.value);
      const secondRegister = registry.register(woodResult.value);

      expect(firstRegister.ok).toBe(true);
      expect(secondRegister.ok).toBe(false);
    }
  });

  it('rejects invalid global ids', () => {
    const result = validateResourceTypeDefinition({
      id: 'INVALID-ID',
      name: 'Invalid',
      description: 'Invalid id test.',
      category: 'PRIMARY_RESOURCE',
      tier: 1,
      state: 'SOLID',
      weight: 1,
      volume: 1,
      basePrice: 1,
      marketEnabled: true,
      tradable: true,
      stackSize: 1,
      storageType: 'WAREHOUSE',
      transportType: 'TRUCK',
      qualityEnabled: false,
      decayEnabled: false,
      hazardous: false,
      flammable: false,
      recyclable: false,
      energyValue: 0,
      requiredResearch: [],
      tags: [],
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });
});
