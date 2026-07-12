/**
 * @module @domain/milestone/CompanyMilestonesId
 *
 * Strongly typed company milestones aggregate identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for company milestones aggregates. */
export type CompanyMilestonesId = Identifier<'CompanyMilestones'>;

/** Creates a validated company milestones identifier from a raw string. */
export function createCompanyMilestonesId(
  rawValue: string,
): Result<CompanyMilestonesId, ValidationError> {
  const result = Identifier.create<CompanyMilestonesId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
