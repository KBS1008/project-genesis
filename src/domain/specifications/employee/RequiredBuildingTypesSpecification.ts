/**
 * @module @domain/specifications/employee/RequiredBuildingTypesSpecification
 *
 * Checks whether a company owns the required active building types.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { Specification } from '../Specification.js';

/** Candidate requiring building type prerequisites. */
export type RequiredBuildingTypesCandidate = {
  readonly subjectId: string;
  readonly requiredBuildingTypes: readonly string[];
};

/** Building ownership context supplied by the application layer. */
export type RequiredBuildingTypesContext = {
  readonly ownedActiveBuildingTypes: ReadonlySet<string>;
};

/**
 * Verifies that all required building types are owned and active.
 */
export class RequiredBuildingTypesSpecification implements Specification<
  RequiredBuildingTypesCandidate,
  RequiredBuildingTypesContext
> {
  isSatisfiedBy(
    candidate: RequiredBuildingTypesCandidate,
    context: RequiredBuildingTypesContext,
  ): Result<void, ValidationError> {
    for (const buildingTypeId of candidate.requiredBuildingTypes) {
      if (!context.ownedActiveBuildingTypes.has(buildingTypeId)) {
        return Result.fail(
          new ValidationError(
            `"${candidate.subjectId}" requires an active building of type "${buildingTypeId}".`,
          ),
        );
      }
    }

    return Result.ok(undefined);
  }
}
