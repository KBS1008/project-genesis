/**
 * @module @domain/specifications/AndSpecification
 *
 * Combines multiple specifications with logical AND semantics.
 */

import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Specification } from './Specification.js';

/**
 * Passes only when every wrapped specification passes.
 */
export class AndSpecification<TCandidate, TContext> implements Specification<TCandidate, TContext> {
  readonly #specifications: readonly Specification<TCandidate, TContext>[];

  /**
   * @param specifications - Specifications that must all pass.
   */
  constructor(specifications: readonly Specification<TCandidate, TContext>[]) {
    this.#specifications = specifications;
  }

  isSatisfiedBy(
    candidate: TCandidate,
    context: TContext,
  ): Result<void, ValidationError> {
    for (const specification of this.#specifications) {
      const result = specification.isSatisfiedBy(candidate, context);

      if (!result.ok) {
        return result;
      }
    }

    return Result.ok(undefined);
  }
}
