/**
 * @module @domain/specifications/production/BuildingSupportsRecipeSpecification
 *
 * Checks whether a building type may execute a recipe.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { Specification } from '../Specification.js';

/** Candidate building and recipe pairing. */
export type BuildingSupportsRecipeCandidate = {
  readonly buildingTypeId: string;
  readonly recipeId: string;
};

/** Recipe eligibility context supplied by the application layer. */
export type BuildingSupportsRecipeContext = {
  readonly allowedBuildingTypes: readonly string[];
};

/**
 * Verifies that a recipe may run on a building type.
 */
export class BuildingSupportsRecipeSpecification implements Specification<
  BuildingSupportsRecipeCandidate,
  BuildingSupportsRecipeContext
> {
  isSatisfiedBy(
    candidate: BuildingSupportsRecipeCandidate,
    context: BuildingSupportsRecipeContext,
  ): Result<void, ValidationError> {
    if (context.allowedBuildingTypes.includes(candidate.buildingTypeId)) {
      return Result.ok(undefined);
    }

    return Result.fail(
      new ValidationError(
        `Building type "${candidate.buildingTypeId}" cannot execute recipe "${candidate.recipeId}".`,
      ),
    );
  }
}
