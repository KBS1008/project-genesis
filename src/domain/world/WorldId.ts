/**
 * @module @domain/world/WorldId
 *
 * Strongly typed identifier for world runtime entities.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Identifier brand for world runtime entities. */
export type WorldId = Identifier<'World'>;

/** Creates a validated world identifier from a raw string. */
export function createWorldId(rawValue: string): Result<WorldId, ValidationError> {
  const result = Identifier.create<WorldId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
