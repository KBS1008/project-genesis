import { BuildingSupportsRecipeSpecification } from './BuildingSupportsRecipeSpecification.js';

describe('BuildingSupportsRecipeSpecification', () => {
  const specification = new BuildingSupportsRecipeSpecification();

  it('passes when the building type is allowed for the recipe', () => {
    const result = specification.isSatisfiedBy(
      { buildingTypeId: 'sawmill', recipeId: 'recipe_planks' },
      { allowedBuildingTypes: ['sawmill', 'warehouse'] },
    );

    expect(result.ok).toBe(true);
  });

  it('fails when the building type is not allowed for the recipe', () => {
    const result = specification.isSatisfiedBy(
      { buildingTypeId: 'warehouse', recipeId: 'recipe_planks' },
      { allowedBuildingTypes: ['sawmill'] },
    );

    expect(result.ok).toBe(false);
  });
});
