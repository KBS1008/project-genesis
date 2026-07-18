/**
 * @module @application/read-models/projectMarketPrice
 *
 * Maps domain market prices to dashboard read models with supply and demand context.
 */

import { MARKET_BASELINE_DEMAND } from '../../domain/market/MarketPriceConstants.js';
import { MarketPressureCalculator } from '../../domain/market/MarketPressureCalculator.js';
import type { ResourceMarketPrice } from '../../domain/market/ResourceMarketPrice.js';
import type { MarketPriceReadModel } from './MarketPriceReadModel.js';

/**
 * Projects one market price line with aggregate supply and demand metrics.
 */
export function projectMarketPrice(
  price: ResourceMarketPrice,
  totalSupply: number,
  baselineDemand: number = MARKET_BASELINE_DEMAND,
): MarketPriceReadModel {
  const changePercent = MarketPressureCalculator.computeChangePercent(
    price.lastPrice,
    price.basePrice,
  );

  return Object.freeze({
    resourceId: price.resourceId.value,
    basePrice: price.basePrice,
    lastPrice: price.lastPrice,
    tradeVolume: price.tradeVolume,
    updatedAt: price.updatedAt,
    totalSupply,
    baselineDemand,
    pressureIndex: MarketPressureCalculator.computePressureIndex(totalSupply, baselineDemand),
    changeFromBase: MarketPressureCalculator.computeChangeFromBase(
      price.lastPrice,
      price.basePrice,
    ),
    changePercent,
    trend: MarketPressureCalculator.computeTrend(changePercent),
  });
}
