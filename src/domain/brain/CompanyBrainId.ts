/**
 * @module @domain/brain/CompanyBrainId
 *
 * Strongly typed company brain aggregate identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for company brain aggregates. */
export type CompanyBrainId = Identifier<'CompanyBrain'>;

/** Creates a validated company brain identifier from a raw string. */
export function createCompanyBrainId(
  rawValue: string,
): Result<CompanyBrainId, ValidationError> {
  const result = Identifier.create<CompanyBrainId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
