/**
 * @module @domain/policies/Policy
 *
 * Contract for domain decision and calculation rules.
 */

import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { Result } from '../../common/result/Result.js';

/**
 * Evaluates a domain policy and returns a typed decision.
 */
export interface Policy<TContext, TDecision> {
  /** Applies the policy to the given context. */
  evaluate(context: TContext): Result<TDecision, ValidationError>;
}
