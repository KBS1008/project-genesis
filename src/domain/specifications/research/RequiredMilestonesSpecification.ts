/**
 * @module @domain/specifications/research/RequiredMilestonesSpecification
 *
 * Checks whether required milestones are completed.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { Specification } from '../Specification.js';

/** Candidate requiring milestone prerequisites. */
export type RequiredMilestonesCandidate = {
  readonly subjectId: string;
  readonly requiredMilestones: readonly string[];
};

/** Milestone completion context supplied by the application layer. */
export type RequiredMilestonesContext = {
  readonly completedMilestones: ReadonlySet<string>;
};

/**
 * Verifies that all required milestones are completed.
 */
export class RequiredMilestonesSpecification
  implements Specification<RequiredMilestonesCandidate, RequiredMilestonesContext>
{
  isSatisfiedBy(
    candidate: RequiredMilestonesCandidate,
    context: RequiredMilestonesContext,
  ): Result<void, ValidationError> {
    for (const milestoneId of candidate.requiredMilestones) {
      if (!context.completedMilestones.has(milestoneId)) {
        return Result.fail(
          new ValidationError(
            `"${candidate.subjectId}" requires completed milestone "${milestoneId}".`,
          ),
        );
      }
    }

    return Result.ok(undefined);
  }
}
