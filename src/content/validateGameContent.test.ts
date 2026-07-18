import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from './validateGameContent.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../game-content');

describe('validateGameContent', () => {
  it('loads and validates official game content', async () => {
    const result = await validateGameContent(gameContentRoot);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.resourceTypes.size).toBeGreaterThanOrEqual(3);
      expect(result.value.milestones.size).toBeGreaterThanOrEqual(1);
      expect(result.value.technologies.size).toBeGreaterThanOrEqual(1);
      expect(result.value.buildingTypes.size).toBeGreaterThanOrEqual(2);
      expect(result.value.employees.size).toBeGreaterThanOrEqual(5);
      expect(result.value.recipes.size).toBeGreaterThanOrEqual(1);
      expect(result.value.recipes.has('recipe_planks')).toBe(true);
      expect(result.value.employees.has('employee_production_worker')).toBe(true);
    }
  });

  it('passes strict building/recipe consistency checks for official content', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);
  });
});
