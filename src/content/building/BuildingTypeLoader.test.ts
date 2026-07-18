import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BuildingTypeLoader } from './BuildingTypeLoader.js';
import { BuildingTypeRegistry } from './BuildingTypeRegistry.js';
import { validateBuildingTypeDefinition } from './BuildingTypeValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.resolve(testDirectory, '../../../tests/fixtures/buildings');
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/buildings');

describe('BuildingTypeLoader', () => {
  const loader = new BuildingTypeLoader();

  it('loads valid building type fixtures into a registry', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(2);
      expect(result.value.has('sawmill')).toBe(true);
      expect(result.value.has('warehouse')).toBe(true);

      const sawmill = result.value.get('sawmill');
      expect(sawmill?.category).toBe('PRODUCTION');
      expect(sawmill?.size.width).toBe(3);
      expect(sawmill?.allowedRecipes).toEqual(['recipe_planks']);

      const warehouse = result.value.get('warehouse');
      expect(warehouse?.category).toBe('STORAGE');
      expect(warehouse?.storageCapacity).toBe(500);
    }
  });

  it('loads official game content building types', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns building types in deterministic order', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getAll().map((buildingType) => buildingType.id)).toEqual([
        'sawmill',
        'warehouse',
      ]);
    }
  });

  it('rejects duplicate building type ids across files', async () => {
    const registry = new BuildingTypeRegistry();
    const sawmillResult = await loader.loadFile(path.join(fixturesDirectory, 'sawmill.yaml'));

    expect(sawmillResult.ok).toBe(true);

    if (sawmillResult.ok) {
      const firstRegister = registry.register(sawmillResult.value);
      const secondRegister = registry.register(sawmillResult.value);

      expect(firstRegister.ok).toBe(true);
      expect(secondRegister.ok).toBe(false);
    }
  });

  it('rejects invalid global ids', () => {
    const result = validateBuildingTypeDefinition({
      id: 'INVALID-ID',
      name: 'Invalid',
      description: 'Invalid id test.',
      category: 'PRODUCTION',
      size: { width: 1, height: 1 },
      energyUsage: 0,
      maintenanceCost: 0,
      constructionCost: 0,
      constructionTime: 0,
      allowedRecipes: [],
      maxProductionLines: 1,
      requiredResearch: [],
      requiredMilestones: [],
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });
});
