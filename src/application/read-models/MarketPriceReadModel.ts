/**
 * @module @application/read-models/MarketPriceReadModel
 *
 * Read-side projection of one resource market price.
 */

import type { MarketPriceTrend } from '../../domain/market/MarketPressureCalculator.js';

/** Immutable market price data returned by queries. */
export type MarketPriceReadModel = {
  readonly resourceId: string;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;
  readonly updatedAt: number;
  readonly totalSupply: number;
  readonly baselineDemand: number;
  readonly pressureIndex: number;
  readonly changeFromBase: number;
  readonly changePercent: number;
  readonly trend: MarketPriceTrend;
};
