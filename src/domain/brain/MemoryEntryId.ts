/**
 * @module @domain/brain/MemoryEntryId
 *
 * Strongly typed memory entry identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for memory entries. */
export type MemoryEntryId = Identifier<'MemoryEntry'>;

/** Creates a validated memory entry identifier from a raw string. */
export function createMemoryEntryId(
  rawValue: string,
): Result<MemoryEntryId, ValidationError> {
  const result = Identifier.create<MemoryEntryId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
