import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MilestoneLoader } from './MilestoneLoader.js';
import { MilestoneRegistry } from './MilestoneRegistry.js';
import { validateMilestoneDefinition } from './MilestoneValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.resolve(testDirectory, '../../../tests/fixtures/milestones');
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/milestones');

describe('MilestoneLoader', () => {
  const loader = new MilestoneLoader();

  it('loads valid milestone fixtures into a registry', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(1);
      expect(result.value.has('first_profit')).toBe(true);

      const milestone = result.value.get('first_profit');
      expect(milestone?.trigger.type).toBe('FIRST_SALE');
    }
  });

  it('loads official game content milestones', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBeGreaterThanOrEqual(1);
    }
  });

  it('rejects duplicate milestone ids across files', async () => {
    const registry = new MilestoneRegistry();
    const loadResult = await loader.loadFile(path.join(fixturesDirectory, 'first_profit.yaml'));

    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      const firstRegister = registry.register(loadResult.value);
      const secondRegister = registry.register(loadResult.value);

      expect(firstRegister.ok).toBe(true);
      expect(secondRegister.ok).toBe(false);
    }
  });

  it('rejects invalid global ids', () => {
    const result = validateMilestoneDefinition({
      id: 'INVALID-ID',
      name: 'Invalid',
      description: 'Invalid id test.',
      trigger: { type: 'FIRST_SALE' },
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });

  it('validates production volume triggers with count and optional recipe id', () => {
    const result = validateMilestoneDefinition({
      id: 'first_production',
      name: 'First Production',
      description: 'Complete one production job.',
      trigger: { type: 'PRODUCTION_VOLUME', count: 3, recipeId: 'recipe_planks' },
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.trigger).toEqual({
        type: 'PRODUCTION_VOLUME',
        count: 3,
        recipeId: 'recipe_planks',
      });
    }
  });

  it('validates profit threshold triggers with amount', () => {
    const result = validateMilestoneDefinition({
      id: 'profit_100',
      name: 'Steady Sales',
      description: 'Earn 100 GC from sales.',
      trigger: { type: 'PROFIT_THRESHOLD', amount: 100 },
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.trigger).toEqual({
        type: 'PROFIT_THRESHOLD',
        amount: 100,
      });
    }
  });
});
