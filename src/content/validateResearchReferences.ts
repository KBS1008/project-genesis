/**
 * @module @content/validateResearchReferences
 *
 * Validates requiredResearch references against the technology registry.
 */

import { Result } from '../common/result/Result.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import type { RecipeRegistry } from './recipe/RecipeRegistry.js';
import type { TechnologyRegistry } from './research/TechnologyRegistry.js';

function validateReferenceList(
  ownerId: string,
  field: string,
  references: readonly string[],
  technologies: TechnologyRegistry,
): Result<void, ContentLoadError> {
  for (const reference of references) {
    if (!technologies.has(reference)) {
      return Result.fail(
        new ContentLoadError(
          `${ownerId} references unknown technology "${reference}" in "${field}".`,
          { contentId: ownerId },
        ),
      );
    }
  }

  return Result.ok(undefined);
}

/**
 * Ensures building, recipe and technology prerequisite references are valid.
 */
export function validateResearchReferences(
  technologies: TechnologyRegistry,
  buildingTypes: BuildingTypeRegistry,
  recipes: RecipeRegistry,
): Result<void, ContentLoadError> {
  for (const technology of technologies.getAll()) {
    const prerequisiteResult = validateReferenceList(
      technology.id,
      'requiredResearch',
      technology.requiredResearch,
      technologies,
    );

    if (!prerequisiteResult.ok) {
      return prerequisiteResult;
    }
  }

  for (const buildingType of buildingTypes.getAll()) {
    const researchResult = validateReferenceList(
      buildingType.id,
      'requiredResearch',
      buildingType.requiredResearch,
      technologies,
    );

    if (!researchResult.ok) {
      return researchResult;
    }
  }

  for (const recipe of recipes.getAll()) {
    const researchResult = validateReferenceList(
      recipe.id,
      'requiredResearch',
      recipe.requiredResearch,
      technologies,
    );

    if (!researchResult.ok) {
      return researchResult;
    }
  }

  return Result.ok(undefined);
}
