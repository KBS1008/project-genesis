/**
 * @module @application/persistence/regionalMarketSnapshotMapper
 *
 * Maps regional market aggregates to and from V3 savegame snapshots.
 */

import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import type {
  GameSaveRegionalMarketPriceHistorySnapshotV3,
  GameSaveRegionalMarketPriceSnapshotV3,
  GameSaveRegionalMarketSnapshotV3,
} from './GameSaveSnapshotV3.js';

/** Serializes all regional markets from the repository. */
export function serializeRegionalMarkets(
  marketRepository: MarketRepository,
): readonly GameSaveRegionalMarketSnapshotV3[] {
  return Object.freeze(
    [...marketRepository.findAll()]
      .sort((left, right) => {
        const regionCompare = left.getRegionId().localeCompare(right.getRegionId());

        if (regionCompare !== 0) {
          return regionCompare;
        }

        return left.getId().value.localeCompare(right.getId().value);
      })
      .map((market) =>
        Object.freeze({
          id: market.getId().value,
          regionId: market.getRegionId(),
          createdAt: market.getCreatedAt(),
          prices: Object.freeze(
            [...market.getPrices()]
              .sort((left, right) => left.resourceId.value.localeCompare(right.resourceId.value))
              .map(
                (price): GameSaveRegionalMarketPriceSnapshotV3 =>
                  Object.freeze({
                    resourceId: price.resourceId.value,
                    basePrice: price.basePrice,
                    lastPrice: price.lastPrice,
                    tradeVolume: price.tradeVolume,
                    updatedAt: price.updatedAt,
                    supply: price.supply,
                    demand: price.demand,
                    liquidity: price.liquidity,
                  }),
              ),
          ),
          priceHistory: Object.freeze(
            [...market.getPriceHistory()]
              .sort((left, right) => {
                if (left.tick !== right.tick) {
                  return left.tick - right.tick;
                }

                return left.resourceId.localeCompare(right.resourceId);
              })
              .map(
                (entry): GameSaveRegionalMarketPriceHistorySnapshotV3 =>
                  Object.freeze({
                    tick: entry.tick,
                    resourceId: entry.resourceId,
                    price: entry.price,
                    tradeVolume: entry.tradeVolume,
                    supply: entry.supply,
                    demand: entry.demand,
                    liquidity: entry.liquidity,
                  }),
              ),
          ),
        }),
      ),
  );
}
