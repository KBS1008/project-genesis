/**
 * @module @domain/production/RecipeId
 *
 * Strongly typed identifier referencing a static recipe definition.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Identifier brand referencing a static recipe definition. */
export type RecipeId = Identifier<'Recipe'>;

/** Creates a validated recipe identifier. */
export function createRecipeId(value: string): Result<RecipeId, ValidationError> {
  const result = Identifier.create<RecipeId>(value);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
