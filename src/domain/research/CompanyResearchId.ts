/**
 * @module @domain/research/CompanyResearchId
 *
 * Strongly typed company research aggregate identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for company research aggregates. */
export type CompanyResearchId = Identifier<'CompanyResearch'>;

/** Creates a validated company research identifier from a raw string. */
export function createCompanyResearchId(
  rawValue: string,
): Result<CompanyResearchId, ValidationError> {
  const result = Identifier.create<CompanyResearchId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
