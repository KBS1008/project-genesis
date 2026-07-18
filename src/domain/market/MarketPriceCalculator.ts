/**
 * @module @domain/market/MarketPriceCalculator
 *
 * Pure supply-and-demand price calculations for the global market.
 *
 * @see docs/gameplay/economy.md
 */

import {
  MARKET_MIN_PRICE_RATIO,
  MARKET_MIN_SUPPLY_UNITS,
  MARKET_MAX_PRICE_RATIO,
  MARKET_PRICE_ADJUSTMENT_RATE,
} from './MarketPriceConstants.js';

/** Input values required to compute the next market price. */
export type MarketPriceAdjustmentInput = {
  readonly lastPrice: number;
  readonly basePrice: number;
  readonly totalSupply: number;
  readonly baselineDemand: number;
};

/**
 * Computes the next market price from supply, demand and the current quote.
 */
export class MarketPriceCalculator {
  /**
   * Returns the next price in credits, rounded to the nearest integer.
   *
   * Higher supply pushes prices toward the base price from below.
   * Lower supply pushes prices above the base price, clamped by configured ratios.
   */
  static computeNextPrice(input: MarketPriceAdjustmentInput): number {
    const effectiveSupply = Math.max(input.totalSupply, MARKET_MIN_SUPPLY_UNITS);
    const pressureIndex = input.baselineDemand / effectiveSupply;
    const targetPrice = input.basePrice * pressureIndex;
    const adjusted =
      input.lastPrice + (targetPrice - input.lastPrice) * MARKET_PRICE_ADJUSTMENT_RATE;
    const minPrice = input.basePrice * MARKET_MIN_PRICE_RATIO;
    const maxPrice = input.basePrice * MARKET_MAX_PRICE_RATIO;
    const clamped = Math.min(Math.max(adjusted, minPrice), maxPrice);

    return Math.round(clamped);
  }
}
