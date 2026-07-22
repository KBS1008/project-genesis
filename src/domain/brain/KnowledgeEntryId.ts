/**
 * @module @domain/brain/KnowledgeEntryId
 *
 * Strongly typed knowledge entry identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for knowledge entries. */
export type KnowledgeEntryId = Identifier<'KnowledgeEntry'>;

/** Creates a validated knowledge entry identifier from a raw string. */
export function createKnowledgeEntryId(
  rawValue: string,
): Result<KnowledgeEntryId, ValidationError> {
  const result = Identifier.create<KnowledgeEntryId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
