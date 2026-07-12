/**
 * @module @domain/milestone/MilestoneId
 *
 * Strongly typed milestone identifier.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Branded identifier for milestone content ids. */
export type MilestoneId = Identifier<'Milestone'>;

/** Creates a validated milestone identifier from a raw string. */
export function createMilestoneId(rawValue: string): Result<MilestoneId, ValidationError> {
  const result = Identifier.create<MilestoneId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
