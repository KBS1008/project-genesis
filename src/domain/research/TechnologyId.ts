/**
 * @module @domain/research/TechnologyId
 *
 * Strongly typed technology identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for static technology definitions. */
export type TechnologyId = Identifier<'Technology'>;

/** Creates a validated technology identifier from a raw string. */
export function createTechnologyId(rawValue: string): Result<TechnologyId, ValidationError> {
  const result = Identifier.create<TechnologyId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
