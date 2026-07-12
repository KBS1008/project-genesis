import { BuildingTypeDefinition } from './building/BuildingTypeDefinition.js';
import { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { RecipeDefinition } from './recipe/RecipeDefinition.js';
import { RecipeRegistry } from './recipe/RecipeRegistry.js';
import { validateBuildingRecipeConsistency } from './validateBuildingRecipeConsistency.js';

function createBuildingType(
  id: string,
  allowedRecipes: readonly string[] = [],
): BuildingTypeDefinition {
  return new BuildingTypeDefinition({
    id,
    name: id,
    description: `${id} description.`,
    category: 'PRODUCTION',
    size: { width: 1, height: 1 },
    energyUsage: 0,
    energyGeneration: 0,
    maintenanceCost: 0,
    constructionCost: 0,
    constructionTime: 0,
    allowedRecipes,
    maxProductionLines: 1,
    requiredResearch: [],
    requiredMilestones: [],
    enabled: true,
    version: 1,
  });
}

function createRecipe(id: string, buildingTypes: readonly string[]): RecipeDefinition {
  return new RecipeDefinition({
    id,
    name: id,
    description: `${id} description.`,
    version: 1,
    category: 'WOOD',
    buildingTypes,
    inputs: [{ resource: 'wood', amount: 1 }],
    outputs: [{ resource: 'planks', amount: 1 }],
    duration: 10,
    energy: 0,
    workers: 0,
    requiredResearch: [],
    requiredBuildings: [],
    requiredMilestones: [],
    requiredResources: [],
    maintenanceCost: 0,
    productionCost: 0,
    experience: 0,
    tags: [],
    enabled: true,
  });
}

function registerBuildingTypes(
  ...definitions: readonly BuildingTypeDefinition[]
): BuildingTypeRegistry {
  const registry = new BuildingTypeRegistry();

  for (const definition of definitions) {
    const result = registry.register(definition);

    if (!result.ok) {
      throw new Error(result.error.message);
    }
  }

  return registry;
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

describe('validateBuildingRecipeConsistency', () => {
  it('accepts consistent building and recipe references', () => {
    const buildingTypes = registerBuildingTypes(createBuildingType('sawmill', ['recipe_planks']));
    const recipes = registerRecipes(createRecipe('recipe_planks', ['sawmill']));

    const result = validateBuildingRecipeConsistency(buildingTypes, recipes, { strict: true });

    expect(result.ok).toBe(true);
  });

  it('rejects unknown recipes in allowedRecipes', () => {
    const buildingTypes = registerBuildingTypes(createBuildingType('sawmill', ['missing_recipe']));
    const recipes = registerRecipes();

    const result = validateBuildingRecipeConsistency(buildingTypes, recipes);

    expect(result.ok).toBe(false);
  });

  it('rejects recipes missing buildingTypes in strict mode', () => {
    const buildingTypes = registerBuildingTypes(createBuildingType('sawmill', ['recipe_planks']));
    const recipes = registerRecipes(createRecipe('recipe_planks', ['warehouse']));

    const result = validateBuildingRecipeConsistency(buildingTypes, recipes, { strict: true });

    expect(result.ok).toBe(false);
  });

  it('rejects buildings missing allowedRecipes in strict mode', () => {
    const buildingTypes = registerBuildingTypes(createBuildingType('sawmill', []));
    const recipes = registerRecipes(createRecipe('recipe_planks', ['sawmill']));

    const result = validateBuildingRecipeConsistency(buildingTypes, recipes, { strict: true });

    expect(result.ok).toBe(false);
  });
});
