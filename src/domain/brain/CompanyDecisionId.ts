/**
 * @module @domain/brain/CompanyDecisionId
 *
 * Strongly typed company decision identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for queued company decisions. */
export type CompanyDecisionId = Identifier<'CompanyDecision'>;

/** Creates a validated company decision identifier from a raw string. */
export function createCompanyDecisionId(
  rawValue: string,
): Result<CompanyDecisionId, ValidationError> {
  const result = Identifier.create<CompanyDecisionId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
