/**
 * @module @domain/specifications/market/ResourceListedOnMarketSpecification
 *
 * Checks whether a resource is listed on the market.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { Specification } from '../Specification.js';

/** Candidate resource for market listing checks. */
export type ResourceListedOnMarketCandidate = {
  readonly resourceId: string;
};

/** Market listing context supplied by the application layer. */
export type ResourceListedOnMarketContext = {
  readonly isListed: boolean;
};

/**
 * Verifies that a resource is currently listed on the market.
 */
export class ResourceListedOnMarketSpecification implements Specification<
  ResourceListedOnMarketCandidate,
  ResourceListedOnMarketContext
> {
  isSatisfiedBy(
    candidate: ResourceListedOnMarketCandidate,
    context: ResourceListedOnMarketContext,
  ): Result<void, ValidationError> {
    if (context.isListed) {
      return Result.ok(undefined);
    }

    return Result.fail(
      new ValidationError(`Resource "${candidate.resourceId}" is not listed on the market.`),
    );
  }
}
