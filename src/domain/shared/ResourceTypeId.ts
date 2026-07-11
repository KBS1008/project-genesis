/**
 * @module @domain/shared/ResourceTypeId
 *
 * Strongly typed identifier referencing a static resource type definition.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Identifier brand referencing a static resource type definition. */
export type ResourceTypeId = Identifier<'ResourceType'>;

/**
 * Creates a validated resource type identifier.
 *
 * @param value - Raw resource type id from content or commands.
 */
export function createResourceTypeId(value: string): Result<ResourceTypeId, ValidationError> {
  const result = Identifier.create<ResourceTypeId>(value);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
