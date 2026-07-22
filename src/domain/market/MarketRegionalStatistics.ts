/**
 * @module @domain/market/MarketRegionalStatistics
 *
 * Aggregated regional market indicators derived from current price lines.
 */

import type { ResourceMarketPrice } from './ResourceMarketPrice.js';

/** Aggregated statistics for one regional market. */
export type MarketRegionalStatistics = {
  readonly regionId: string;
  readonly resourceCount: number;
  readonly totalTradeVolume: number;
  readonly averageLiquidity: number;
  readonly averageSupply: number;
  readonly averageDemand: number;
};

/** Computes deterministic regional statistics from current market price lines. */
export function computeMarketRegionalStatistics(
  regionId: string,
  prices: readonly ResourceMarketPrice[],
): MarketRegionalStatistics {
  if (prices.length === 0) {
    return Object.freeze({
      regionId,
      resourceCount: 0,
      totalTradeVolume: 0,
      averageLiquidity: 0,
      averageSupply: 0,
      averageDemand: 0,
    });
  }

  let totalTradeVolume = 0;
  let totalLiquidity = 0;
  let totalSupply = 0;
  let totalDemand = 0;

  for (const price of prices) {
    totalTradeVolume += price.tradeVolume;
    totalLiquidity += price.liquidity;
    totalSupply += price.supply;
    totalDemand += price.demand;
  }

  const resourceCount = prices.length;

  return Object.freeze({
    regionId,
    resourceCount,
    totalTradeVolume,
    averageLiquidity: totalLiquidity / resourceCount,
    averageSupply: totalSupply / resourceCount,
    averageDemand: totalDemand / resourceCount,
  });
}
