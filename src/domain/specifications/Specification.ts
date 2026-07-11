/**
 * @module @domain/specifications/Specification
 *
 * Contract for composable domain eligibility checks.
 */

import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { Result } from '../../common/result/Result.js';

/**
 * Evaluates whether a candidate satisfies a domain rule in a given context.
 */
export interface Specification<TCandidate, TContext = void> {
  /** Returns success when the candidate satisfies the rule. */
  isSatisfiedBy(
    candidate: TCandidate,
    context: TContext,
  ): Result<void, ValidationError>;
}
