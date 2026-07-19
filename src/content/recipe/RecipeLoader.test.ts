import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BuildingTypeLoader } from '../building/BuildingTypeLoader.js';
import { ResourceTypeLoader } from '../resource/ResourceTypeLoader.js';
import { RecipeLoader } from './RecipeLoader.js';
import { validateRecipeDefinition } from './RecipeValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesRoot = path.resolve(testDirectory, '../../../tests/fixtures');

describe('RecipeLoader', () => {
  const recipeLoader = new RecipeLoader();
  const resourceLoader = new ResourceTypeLoader();
  const buildingLoader = new BuildingTypeLoader();

  async function loadReferenceContext() {
    const resourcesResult = await resourceLoader.loadFromDirectory(
      path.join(fixturesRoot, 'resources'),
    );

    if (!resourcesResult.ok) {
      throw new Error(resourcesResult.error.message);
    }

    const buildingsResult = await buildingLoader.loadFromDirectory(
      path.join(fixturesRoot, 'buildings'),
    );

    if (!buildingsResult.ok) {
      throw new Error(buildingsResult.error.message);
    }

    return {
      resourceTypes: resourcesResult.value,
      buildingTypes: buildingsResult.value,
    };
  }

  it('loads valid recipe fixtures with reference validation', async () => {
    const references = await loadReferenceContext();
    const result = await recipeLoader.loadFromDirectory(
      path.join(fixturesRoot, 'recipes'),
      references,
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(1);

      const recipe = result.value.get('recipe_planks');
      expect(recipe?.buildingTypes).toEqual(['sawmill']);
      expect(recipe?.inputs[0]?.resource).toBe('wood');
      expect(recipe?.outputs[0]?.resource).toBe('planks');
    }
  });

  it('rejects recipes referencing unknown resources', async () => {
    const references = await loadReferenceContext();

    const result = validateRecipeDefinition(
      {
        id: 'recipe_invalid',
        name: 'Invalid',
        description: 'Invalid recipe.',
        version: 1,
        category: 'WOOD',
        buildingTypes: ['sawmill'],
        inputs: [{ resource: 'missing_resource', amount: 1 }],
        outputs: [{ resource: 'wood', amount: 1 }],
        duration: 10,
        energy: 0,
        workers: 0,
        requiredResearch: [],
        requiredMilestones: [],
        maintenanceCost: 0,
        productionCost: 0,
        experience: 0,
        tags: [],
        enabled: true,
      },
      undefined,
      references,
    );

    expect(result.ok).toBe(false);
  });

  it('rejects recipes referencing unknown building types', async () => {
    const references = await loadReferenceContext();

    const result = validateRecipeDefinition(
      {
        id: 'recipe_invalid',
        name: 'Invalid',
        description: 'Invalid recipe.',
        version: 1,
        category: 'WOOD',
        buildingTypes: ['missing_building'],
        inputs: [{ resource: 'wood', amount: 1 }],
        outputs: [{ resource: 'planks', amount: 1 }],
        duration: 10,
        energy: 0,
        workers: 0,
        requiredResearch: [],
        requiredMilestones: [],
        maintenanceCost: 0,
        productionCost: 0,
        experience: 0,
        tags: [],
        enabled: true,
      },
      undefined,
      references,
    );

    expect(result.ok).toBe(false);
  });
});
