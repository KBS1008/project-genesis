/**
 * @module @content/validateMilestoneReferences
 *
 * Validates requiredMilestones references against the milestone registry.
 */

import { Result } from '../common/result/Result.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import type { MilestoneRegistry } from './milestone/MilestoneRegistry.js';
import type { RecipeRegistry } from './recipe/RecipeRegistry.js';
import type { TechnologyRegistry } from './research/TechnologyRegistry.js';

function validateReferenceList(
  ownerId: string,
  field: string,
  references: readonly string[],
  milestones: MilestoneRegistry,
): Result<void, ContentLoadError> {
  for (const reference of references) {
    if (!milestones.has(reference)) {
      return Result.fail(
        new ContentLoadError(
          `${ownerId} references unknown milestone "${reference}" in "${field}".`,
          { contentId: ownerId },
        ),
      );
    }
  }

  return Result.ok(undefined);
}

/**
 * Ensures building, recipe and technology milestone prerequisite references are valid.
 */
export function validateMilestoneReferences(
  milestones: MilestoneRegistry,
  buildingTypes: BuildingTypeRegistry,
  recipes: RecipeRegistry,
  technologies: TechnologyRegistry,
): Result<void, ContentLoadError> {
  for (const buildingType of buildingTypes.getAll()) {
    const milestoneResult = validateReferenceList(
      buildingType.id,
      'requiredMilestones',
      buildingType.requiredMilestones,
      milestones,
    );

    if (!milestoneResult.ok) {
      return Result.fail(milestoneResult.error);
    }
  }

  for (const recipe of recipes.getAll()) {
    const milestoneResult = validateReferenceList(
      recipe.id,
      'requiredMilestones',
      recipe.requiredMilestones,
      milestones,
    );

    if (!milestoneResult.ok) {
      return Result.fail(milestoneResult.error);
    }
  }

  for (const technology of technologies.getAll()) {
    const milestoneResult = validateReferenceList(
      technology.id,
      'requiredMilestones',
      technology.requiredMilestones,
      milestones,
    );

    if (!milestoneResult.ok) {
      return Result.fail(milestoneResult.error);
    }
  }

  return Result.ok(undefined);
}
