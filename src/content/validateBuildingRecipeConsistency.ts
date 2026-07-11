/**
 * @module @content/validateBuildingRecipeConsistency
 *
 * Cross-registry consistency checks between building types and recipes.
 */

import { Result } from '../common/result/Result.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import type { RecipeRegistry } from './recipe/RecipeRegistry.js';

/** Options for building/recipe consistency validation. */
export type ValidateBuildingRecipeConsistencyOptions = {
  /** When true, also validates bidirectional allowedRecipes ↔ buildingTypes links. */
  readonly strict?: boolean;
};

/**
 * Validates references between building types and recipes.
 *
 * Always checks that every `allowedRecipes` entry exists in the recipe registry.
 * In strict mode, also checks that recipe `buildingTypes` and building
 * `allowedRecipes` reference each other symmetrically.
 */
export function validateBuildingRecipeConsistency(
  buildingTypes: BuildingTypeRegistry,
  recipes: RecipeRegistry,
  options: ValidateBuildingRecipeConsistencyOptions = {},
): Result<void, ContentLoadError> {
  const strict = options.strict ?? false;

  for (const buildingType of buildingTypes.getAll()) {
    for (const recipeId of buildingType.allowedRecipes) {
      if (!recipes.has(recipeId)) {
        return Result.fail(
          new ContentLoadError(
            `Building type "${buildingType.id}" references unknown recipe "${recipeId}".`,
            { contentId: buildingType.id },
          ),
        );
      }

      if (strict) {
        const recipe = recipes.get(recipeId);

        if (recipe !== undefined && !recipe.buildingTypes.includes(buildingType.id)) {
          return Result.fail(
            new ContentLoadError(
              `Recipe "${recipeId}" does not list building type "${buildingType.id}" in buildingTypes.`,
              { contentId: recipeId },
            ),
          );
        }
      }
    }
  }

  if (strict) {
    for (const recipe of recipes.getAll()) {
      for (const buildingTypeId of recipe.buildingTypes) {
        const buildingType = buildingTypes.get(buildingTypeId);

        if (buildingType === undefined) {
          continue;
        }

        if (!buildingType.allowedRecipes.includes(recipe.id)) {
          return Result.fail(
            new ContentLoadError(
              `Building type "${buildingTypeId}" does not list recipe "${recipe.id}" in allowedRecipes.`,
              { contentId: buildingTypeId },
            ),
          );
        }
      }
    }
  }

  return Result.ok(undefined);
}
