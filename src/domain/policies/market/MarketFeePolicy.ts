/**
 * @module @domain/policies/market/MarketFeePolicy
 *
 * Resolves the market fee for an instant trade.
 *
 * @see docs/gameplay/market.md
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import { Guard } from '../../../common/validation/Guard.js';
import {
  MARKET_TRADE_FEE_MINIMUM,
  MARKET_TRADE_FEE_RATE,
} from '../../market/MarketPriceConstants.js';
import type { Policy } from '../Policy.js';

/** Trade value context supplied by the application layer. */
export type MarketFeeContext = {
  readonly tradeValue: number;
};

/** Resolved market fee decision. */
export type MarketFeeDecision = {
  readonly feeAmount: number;
};

/**
 * Determines the market fee for an instant market buy or sell.
 */
export class MarketFeePolicy implements Policy<MarketFeeContext, MarketFeeDecision> {
  evaluate(context: MarketFeeContext): Result<MarketFeeDecision, ValidationError> {
    const tradeValueResult = Guard.againstNegative(
      context.tradeValue,
      'Trade value must not be negative.',
    );

    if (!tradeValueResult.ok) {
      return Result.fail(tradeValueResult.error);
    }

    if (tradeValueResult.value === 0) {
      return Result.ok(
        Object.freeze({
          feeAmount: 0,
        }),
      );
    }

    return Result.ok(
      Object.freeze({
        feeAmount: Math.max(
          MARKET_TRADE_FEE_MINIMUM,
          Math.round(tradeValueResult.value * MARKET_TRADE_FEE_RATE),
        ),
      }),
    );
  }
}
