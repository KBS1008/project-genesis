/**
 * @module @domain/policies/market/InstantTradePricingPolicy
 *
 * Resolves the unit price for an instant market trade.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import { Guard } from '../../../common/validation/Guard.js';
import type { Policy } from '../Policy.js';

/** Market pricing context supplied by the application layer. */
export type InstantTradePricingContext = {
  readonly resourceId: string;
  readonly lastPrice: number | undefined;
};

/** Resolved instant trade unit price. */
export type InstantTradePricingDecision = {
  readonly unitPrice: number;
};

/**
 * Determines the unit price for an instant market buy or sell.
 */
export class InstantTradePricingPolicy implements Policy<
  InstantTradePricingContext,
  InstantTradePricingDecision
> {
  evaluate(
    context: InstantTradePricingContext,
  ): Result<InstantTradePricingDecision, ValidationError> {
    if (context.lastPrice === undefined) {
      return Result.fail(
        new ValidationError(`Resource "${context.resourceId}" is not listed on the market.`),
      );
    }

    const priceResult = Guard.againstNegative(
      context.lastPrice,
      'Market price must not be negative.',
    );

    if (!priceResult.ok) {
      return Result.fail(priceResult.error);
    }

    return Result.ok(
      Object.freeze({
        unitPrice: priceResult.value,
      }),
    );
  }
}
