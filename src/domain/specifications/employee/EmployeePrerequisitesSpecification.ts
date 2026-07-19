/**
 * @module @domain/specifications/employee/EmployeePrerequisitesSpecification
 *
 * Checks employee hiring prerequisites for research and buildings.
 */

import type { ValidationError } from '../../../common/errors/ValidationError.js';
import type { Result } from '../../../common/result/Result.js';
import { AndSpecification } from '../AndSpecification.js';
import type { Specification } from '../Specification.js';
import { RequiredResearchSpecification } from '../research/RequiredResearchSpecification.js';
import {
  RequiredBuildingTypesSpecification,
  type RequiredBuildingTypesContext,
} from './RequiredBuildingTypesSpecification.js';

/** Candidate employee type for prerequisite checks. */
export type EmployeePrerequisitesCandidate = {
  readonly employeeTypeId: string;
  readonly requiredResearch: readonly string[];
  readonly requiredBuildingTypes: readonly string[];
};

/** Employee hiring prerequisite context supplied by the application layer. */
export type EmployeePrerequisitesContext = {
  readonly completedResearch: ReadonlySet<string>;
  readonly ownedActiveBuildingTypes: ReadonlySet<string>;
};

/**
 * Verifies that an employee type's research and building prerequisites are met.
 */
export class EmployeePrerequisitesSpecification implements Specification<
  EmployeePrerequisitesCandidate,
  EmployeePrerequisitesContext
> {
  readonly #specification = new AndSpecification<
    EmployeePrerequisitesCandidate,
    EmployeePrerequisitesContext
  >([new RequiredResearchAdapterSpecification(), new RequiredBuildingTypesAdapterSpecification()]);

  isSatisfiedBy(
    candidate: EmployeePrerequisitesCandidate,
    context: EmployeePrerequisitesContext,
  ): Result<void, ValidationError> {
    return this.#specification.isSatisfiedBy(candidate, context);
  }
}

class RequiredResearchAdapterSpecification implements Specification<
  EmployeePrerequisitesCandidate,
  EmployeePrerequisitesContext
> {
  readonly #requiredResearchSpecification = new RequiredResearchSpecification();

  isSatisfiedBy(
    candidate: EmployeePrerequisitesCandidate,
    context: EmployeePrerequisitesContext,
  ): Result<void, ValidationError> {
    return this.#requiredResearchSpecification.isSatisfiedBy(
      {
        subjectId: candidate.employeeTypeId,
        requiredResearch: candidate.requiredResearch,
      },
      {
        completedResearch: context.completedResearch,
      },
    );
  }
}

class RequiredBuildingTypesAdapterSpecification implements Specification<
  EmployeePrerequisitesCandidate,
  EmployeePrerequisitesContext
> {
  readonly #requiredBuildingTypesSpecification = new RequiredBuildingTypesSpecification();

  isSatisfiedBy(
    candidate: EmployeePrerequisitesCandidate,
    context: EmployeePrerequisitesContext,
  ): Result<void, ValidationError> {
    return this.#requiredBuildingTypesSpecification.isSatisfiedBy(
      {
        subjectId: candidate.employeeTypeId,
        requiredBuildingTypes: candidate.requiredBuildingTypes,
      },
      {
        ownedActiveBuildingTypes: context.ownedActiveBuildingTypes,
      } satisfies RequiredBuildingTypesContext,
    );
  }
}
