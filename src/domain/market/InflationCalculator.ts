/**
 * @module @domain/market/InflationCalculator
 *
 * Pure inflation index and dampening calculations for the global market.
 */

import {
  INFLATION_DAMPING_FACTOR,
  INFLATION_STIMULUS_FACTOR,
  INFLATION_TARGET_MAX,
  INFLATION_TARGET_MIN,
} from './InflationConstants.js';
import type { ResourceMarketPrice } from './ResourceMarketPrice.js';

/** Input required to derive a global price index. */
export type InflationPriceEntry = {
  readonly basePrice: number;
  readonly lastPrice: number;
};

/**
 * Computes economy-wide inflation signals from market price snapshots.
 */
export class InflationCalculator {
  /** Returns the average lastPrice/basePrice ratio across listed resources. */
  static computePriceIndex(prices: readonly InflationPriceEntry[]): number {
    if (prices.length === 0) {
      return 1;
    }

    const total = prices.reduce((sum, price) => sum + price.lastPrice / price.basePrice, 0);

    return Math.round((total / prices.length) * 100) / 100;
  }

  /** Returns a multiplier applied to market price adjustment rates. */
  static computeAdjustmentMultiplier(priceIndex: number): number {
    if (priceIndex > INFLATION_TARGET_MAX) {
      return INFLATION_DAMPING_FACTOR;
    }

    if (priceIndex < INFLATION_TARGET_MIN) {
      return INFLATION_STIMULUS_FACTOR;
    }

    return 1;
  }

  /** Convenience helper for market aggregate price lines. */
  static computePriceIndexFromMarketPrices(prices: readonly ResourceMarketPrice[]): number {
    return InflationCalculator.computePriceIndex(
      prices.map((price) =>
        Object.freeze({
          basePrice: price.basePrice,
          lastPrice: price.lastPrice,
        }),
      ),
    );
  }
}
