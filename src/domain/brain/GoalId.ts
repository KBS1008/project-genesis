/**
 * @module @domain/brain/GoalId
 *
 * Strongly typed goal identifier within a company brain.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for company goals. */
export type GoalId = Identifier<'Goal'>;

/** Creates a validated goal identifier from a raw string. */
export function createGoalId(rawValue: string): Result<GoalId, ValidationError> {
  const result = Identifier.create<GoalId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
