/**
 * @module @domain/market/MarketPressureCalculator
 *
 * Pure supply-and-demand pressure and trend calculations for market read models.
 */

import { MARKET_MIN_SUPPLY_UNITS } from './MarketPriceConstants.js';

/** Direction of a market price relative to its base price. */
export type MarketPriceTrend = 'UP' | 'DOWN' | 'STABLE';

/**
 * Derives pressure and trend metrics from supply, demand and price quotes.
 */
export class MarketPressureCalculator {
  /** Returns demand divided by effective supply, rounded to two decimals. */
  static computePressureIndex(totalSupply: number, baselineDemand: number): number {
    const effectiveSupply = Math.max(totalSupply, MARKET_MIN_SUPPLY_UNITS);

    return Math.round((baselineDemand / effectiveSupply) * 100) / 100;
  }

  /** Returns the absolute price delta from the resource base price. */
  static computeChangeFromBase(lastPrice: number, basePrice: number): number {
    return lastPrice - basePrice;
  }

  /** Returns the percentage change from base price, rounded to an integer. */
  static computeChangePercent(lastPrice: number, basePrice: number): number {
    if (basePrice === 0) {
      return 0;
    }

    return Math.round(((lastPrice - basePrice) / basePrice) * 100);
  }

  /** Maps a percentage change to a coarse trend direction. */
  static computeTrend(changePercent: number): MarketPriceTrend {
    if (changePercent > 1) {
      return 'UP';
    }

    if (changePercent < -1) {
      return 'DOWN';
    }

    return 'STABLE';
  }
}
