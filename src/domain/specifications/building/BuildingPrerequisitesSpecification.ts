/**
 * @module @domain/specifications/building/BuildingPrerequisitesSpecification
 *
 * Checks building placement prerequisites for research and milestones.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import { AndSpecification } from '../AndSpecification.js';
import type { Specification } from '../Specification.js';
import { RequiredMilestonesSpecification } from '../research/RequiredMilestonesSpecification.js';
import { RequiredResearchSpecification } from '../research/RequiredResearchSpecification.js';

/** Candidate building type for prerequisite checks. */
export type BuildingPrerequisitesCandidate = {
  readonly buildingTypeId: string;
  readonly requiredResearch: readonly string[];
  readonly requiredMilestones: readonly string[];
};

/** Building prerequisite context supplied by the application layer. */
export type BuildingPrerequisitesContext = {
  readonly completedResearch: ReadonlySet<string>;
  readonly completedMilestones: ReadonlySet<string>;
};

/**
 * Verifies that a building type's research and milestone prerequisites are met.
 */
export class BuildingPrerequisitesSpecification
  implements Specification<BuildingPrerequisitesCandidate, BuildingPrerequisitesContext>
{
  readonly #specification = new AndSpecification<
    BuildingPrerequisitesCandidate,
    BuildingPrerequisitesContext
  >([
    new RequiredResearchAdapterSpecification(),
    new RequiredMilestonesAdapterSpecification(),
  ]);

  isSatisfiedBy(
    candidate: BuildingPrerequisitesCandidate,
    context: BuildingPrerequisitesContext,
  ): Result<void, ValidationError> {
    return this.#specification.isSatisfiedBy(candidate, context);
  }
}

class RequiredResearchAdapterSpecification
  implements Specification<BuildingPrerequisitesCandidate, BuildingPrerequisitesContext>
{
  readonly #requiredResearchSpecification = new RequiredResearchSpecification();

  isSatisfiedBy(
    candidate: BuildingPrerequisitesCandidate,
    context: BuildingPrerequisitesContext,
  ): Result<void, ValidationError> {
    return this.#requiredResearchSpecification.isSatisfiedBy(
      {
        subjectId: candidate.buildingTypeId,
        requiredResearch: candidate.requiredResearch,
      },
      {
        completedResearch: context.completedResearch,
      },
    );
  }
}

class RequiredMilestonesAdapterSpecification
  implements Specification<BuildingPrerequisitesCandidate, BuildingPrerequisitesContext>
{
  readonly #requiredMilestonesSpecification = new RequiredMilestonesSpecification();

  isSatisfiedBy(
    candidate: BuildingPrerequisitesCandidate,
    context: BuildingPrerequisitesContext,
  ): Result<void, ValidationError> {
    return this.#requiredMilestonesSpecification.isSatisfiedBy(
      {
        subjectId: candidate.buildingTypeId,
        requiredMilestones: candidate.requiredMilestones,
      },
      {
        completedMilestones: context.completedMilestones,
      },
    );
  }
}
