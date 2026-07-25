import { RecipeDefinition } from './recipe/RecipeDefinition.js';
import { RecipeRegistry } from './recipe/RecipeRegistry.js';
import { ResourceTypeDefinition } from './resource/ResourceTypeDefinition.js';
import { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';
import {
  buildProductionResourceGraph,
  findProductionResourceCycle,
  validateProductionGraphAcyclicity,
} from './validateProductionGraphAcyclicity.js';

function createRecipe(
  id: string,
  inputs: readonly { readonly resource: string; readonly amount: number }[],
  outputs: readonly { readonly resource: string; readonly amount: number }[],
  enabled = true,
): RecipeDefinition {
  return new RecipeDefinition({
    id,
    name: id,
    description: `${id} description.`,
    version: 1,
    category: 'WOOD',
    buildingTypes: ['sawmill'],
    inputs,
    outputs,
    duration: 10,
    energy: 0,
    workers: 0,
    requiredResearch: [],
    requiredMilestones: [],
    maintenanceCost: 0,
    productionCost: 0,
    experience: 0,
    tags: [],
    enabled,
  });
}

function registerRecipes(...definitions: readonly RecipeDefinition[]): RecipeRegistry {
  const registry = new RecipeRegistry();

  for (const definition of definitions) {
    const result = registry.register(definition);

    if (!result.ok) {
      throw new Error(result.error.message);
    }
  }

  return registry;
}

function registerResources(...ids: readonly string[]): ResourceTypeRegistry {
  const registry = new ResourceTypeRegistry();

  for (const id of ids) {
    const result = registry.register(
      new ResourceTypeDefinition({
        id,
        name: id,
        description: `${id} description.`,
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
      }),
    );

    if (!result.ok) {
      throw new Error(result.error.message);
    }
  }

  return registry;
}

describe('validateProductionGraphAcyclicity', () => {
  it('builds directed edges from recipe inputs to outputs', () => {
    const recipes = registerRecipes(
      createRecipe('recipe_a', [{ resource: 'wood', amount: 1 }], [{ resource: 'planks', amount: 1 }]),
      createRecipe(
        'recipe_b',
        [{ resource: 'planks', amount: 1 }],
        [{ resource: 'furniture', amount: 1 }],
      ),
    );

    expect(buildProductionResourceGraph(recipes)).toEqual([
      {
        fromResourceId: 'wood',
        toResourceId: 'planks',
        recipeId: 'recipe_a',
      },
      {
        fromResourceId: 'planks',
        toResourceId: 'furniture',
        recipeId: 'recipe_b',
      },
    ]);
  });

  it('accepts an acyclic production graph', () => {
    const recipes = registerRecipes(
      createRecipe('recipe_a', [{ resource: 'wood', amount: 1 }], [{ resource: 'planks', amount: 1 }]),
      createRecipe(
        'recipe_b',
        [{ resource: 'iron_ore', amount: 1 }],
        [{ resource: 'steel', amount: 1 }],
      ),
      createRecipe(
        'recipe_c',
        [
          { resource: 'steel', amount: 1 },
          { resource: 'planks', amount: 1 },
        ],
        [{ resource: 'machine_parts', amount: 1 }],
      ),
    );

    expect(validateProductionGraphAcyclicity(recipes).ok).toBe(true);
    expect(findProductionResourceCycle(buildProductionResourceGraph(recipes))).toBeUndefined();
  });

  it('detects a two-node production cycle', () => {
    const recipes = registerRecipes(
      createRecipe('recipe_a_to_b', [{ resource: 'resource_a', amount: 1 }], [{ resource: 'resource_b', amount: 1 }]),
      createRecipe('recipe_b_to_a', [{ resource: 'resource_b', amount: 1 }], [{ resource: 'resource_a', amount: 1 }]),
    );

    const result = validateProductionGraphAcyclicity(recipes);

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.message).toContain('Production resource cycle detected');
    expect(result.error.message).toContain('resource_a');
    expect(result.error.message).toContain('resource_b');
  });

  it('detects a three-node production cycle', () => {
    const edges = buildProductionResourceGraph(
      registerRecipes(
        createRecipe('recipe_ab', [{ resource: 'a', amount: 1 }], [{ resource: 'b', amount: 1 }]),
        createRecipe('recipe_bc', [{ resource: 'b', amount: 1 }], [{ resource: 'c', amount: 1 }]),
        createRecipe('recipe_ca', [{ resource: 'c', amount: 1 }], [{ resource: 'a', amount: 1 }]),
      ),
    );

    expect(findProductionResourceCycle(edges)).toEqual(['a', 'b', 'c', 'a']);
  });

  it('rejects a direct input/output cycle within one recipe', () => {
    const recipes = registerRecipes(
      createRecipe(
        'recipe_self_cycle',
        [
          { resource: 'steel', amount: 1 },
          { resource: 'wood', amount: 1 },
        ],
        [{ resource: 'steel', amount: 1 }],
      ),
    );

    const result = validateProductionGraphAcyclicity(recipes);

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.message).toContain('recipe_self_cycle');
    expect(result.error.message).toContain('direct production cycle');
  });

  it('ignores disabled recipes when building the graph', () => {
    const recipes = registerRecipes(
      createRecipe(
        'recipe_disabled_cycle',
        [{ resource: 'resource_a', amount: 1 }],
        [{ resource: 'resource_b', amount: 1 }],
        false,
      ),
      createRecipe(
        'recipe_disabled_cycle_return',
        [{ resource: 'resource_b', amount: 1 }],
        [{ resource: 'resource_a', amount: 1 }],
        false,
      ),
      createRecipe('recipe_ok', [{ resource: 'wood', amount: 1 }], [{ resource: 'planks', amount: 1 }]),
    );

    expect(validateProductionGraphAcyclicity(recipes).ok).toBe(true);
  });

  it('validates that recipe resources exist in the resource registry', () => {
    const recipes = registerRecipes(
      createRecipe('recipe_ok', [{ resource: 'wood', amount: 1 }], [{ resource: 'planks', amount: 1 }]),
    );
    const resourceTypes = registerResources('wood');

    const result = validateProductionGraphAcyclicity(recipes, resourceTypes);

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.message).toContain('unknown resource "planks"');
  });
});
