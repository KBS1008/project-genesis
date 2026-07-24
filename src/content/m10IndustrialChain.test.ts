import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const INDUSTRIAL_CHAIN = Object.freeze([
  { resourceId: 'machine_parts', recipeId: 'recipe_machine_parts', buildingId: 'machine_shop' },
  {
    resourceId: 'industrial_machinery',
    recipeId: 'recipe_industrial_machinery',
    buildingId: 'assembly_plant',
  },
  {
    resourceId: 'advanced_electronics',
    recipeId: 'recipe_advanced_electronics',
    buildingId: 'electronics_factory',
  },
  {
    resourceId: 'consumer_goods',
    recipeId: 'recipe_consumer_goods',
    buildingId: 'consumer_goods_plant',
  },
]);

describe('M10 industrial production chain content', () => {
  it('loads and cross-validates the tier-2 through tier-5 ladder', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { resourceTypes, recipes, buildingTypes, milestones } = result.value;

    expect(resourceTypes.has('steel')).toBe(true);

    for (const step of INDUSTRIAL_CHAIN) {
      expect(resourceTypes.has(step.resourceId)).toBe(true);

      const recipe = recipes.get(step.recipeId);
      expect(recipe).toBeDefined();
      expect(recipe?.buildingTypes).toContain(step.buildingId);

      const building = buildingTypes.get(step.buildingId);
      expect(building).toBeDefined();
      expect(building?.allowedRecipes).toContain(step.recipeId);
    }

    expect(milestones.has('first_machine_parts')).toBe(true);
    expect(milestones.has('first_industrial_machinery')).toBe(true);
    expect(milestones.has('first_advanced_electronics')).toBe(true);
    expect(milestones.has('first_consumer_goods')).toBe(true);
  });
});
