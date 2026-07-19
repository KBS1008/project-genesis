/**
 * @module @domain/specifications/research/RequiredResearchSpecification
 *
 * Checks whether required technologies are completed.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { Specification } from '../Specification.js';

/** Candidate requiring research prerequisites. */
export type RequiredResearchCandidate = {
  readonly subjectId: string;
  readonly requiredResearch: readonly string[];
};

/** Research completion context supplied by the application layer. */
export type RequiredResearchContext = {
  readonly completedResearch: ReadonlySet<string>;
};

/**
 * Verifies that all required technologies are completed.
 */
export class RequiredResearchSpecification implements Specification<
  RequiredResearchCandidate,
  RequiredResearchContext
> {
  isSatisfiedBy(
    candidate: RequiredResearchCandidate,
    context: RequiredResearchContext,
  ): Result<void, ValidationError> {
    for (const technologyId of candidate.requiredResearch) {
      if (!context.completedResearch.has(technologyId)) {
        return Result.fail(
          new ValidationError(
            `"${candidate.subjectId}" requires completed research "${technologyId}".`,
          ),
        );
      }
    }

    return Result.ok(undefined);
  }
}
