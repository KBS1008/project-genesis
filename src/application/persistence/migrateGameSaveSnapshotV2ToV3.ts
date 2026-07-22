/**
 * @module @application/persistence/migrateGameSaveSnapshotV2ToV3
 *
 * Central v2→v3 savegame migration boundary.
 */

import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import type { GameSaveMarketSnapshotV1 } from './GameSaveSnapshotV1.js';
import type { GameSaveSnapshotV2 } from './GameSaveSnapshotV2.js';
import {
  GAME_SAVE_SCHEMA_VERSION,
  type GameSaveRegionalMarketPriceHistorySnapshotV3,
  type GameSaveRegionalMarketPriceSnapshotV3,
  type GameSaveRegionalMarketSnapshotV3,
  type GameSaveSnapshotV3,
} from './GameSaveSnapshotV3.js';
import { orderGameSaveSnapshotV3 } from './orderGameSaveSnapshotV3.js';

/** Raw market row that may contain transitional M8 keys outside the frozen V2 contract. */
type TransitionalMarketSnapshot = GameSaveMarketSnapshotV1 & {
  readonly regionId?: string;
  readonly priceHistory?: readonly GameSaveRegionalMarketPriceHistorySnapshotV3[];
  readonly prices: readonly (GameSaveMarketSnapshotV1['prices'][number] & {
    readonly supply?: number;
    readonly demand?: number;
    readonly liquidity?: number;
  })[];
};

/** V2 snapshot input that may contain transitional market rows. */
export type TransitionalGameSaveSnapshotV2 = Omit<GameSaveSnapshotV2, 'markets'> & {
  readonly markets: readonly TransitionalMarketSnapshot[];
};

/**
 * Upgrades a parsed v2 snapshot to the current v3 schema.
 */
export function migrateGameSaveSnapshotV2ToV3(
  v2: TransitionalGameSaveSnapshotV2,
): GameSaveSnapshotV3 {
  const regionByMarketId = new Map(
    v2.marketRegionMappings.map((mapping) => [mapping.marketId, mapping.regionId]),
  );

  const regionalMarkets = v2.markets.map((market) =>
    normalizeRegionalMarket(market, regionByMarketId.get(market.id)),
  );

  const { markets: _markets, ...v2WithoutMarkets } = v2;

  return orderGameSaveSnapshotV3(
    Object.freeze({
      ...v2WithoutMarkets,
      schemaVersion: GAME_SAVE_SCHEMA_VERSION,
      companyBrains: Object.freeze([]),
      regionalMarkets: Object.freeze(regionalMarkets),
    }),
  );
}

function normalizeRegionalMarket(
  market: TransitionalMarketSnapshot,
  mappedRegionId: string | undefined,
): GameSaveRegionalMarketSnapshotV3 {
  const regionId =
    market.regionId ??
    mappedRegionId ??
    (market.id === GLOBAL_MARKET_ID
      ? DEFAULT_REGION_ID
      : market.id.startsWith('market_')
        ? market.id.slice('market_'.length)
        : DEFAULT_REGION_ID);

  const prices = market.prices.map((price) => {
    const transitionalPrice = price as TransitionalMarketSnapshot['prices'][number];

    return Object.freeze({
      resourceId: price.resourceId,
      basePrice: price.basePrice,
      lastPrice: price.lastPrice,
      tradeVolume: price.tradeVolume,
      updatedAt: price.updatedAt,
      supply: transitionalPrice.supply ?? 0,
      demand: transitionalPrice.demand ?? 0,
      liquidity: transitionalPrice.liquidity ?? 0,
    }) satisfies GameSaveRegionalMarketPriceSnapshotV3;
  });

  return Object.freeze({
    id: market.id,
    regionId,
    createdAt: market.createdAt,
    prices: Object.freeze(prices),
    priceHistory: Object.freeze([...(market.priceHistory ?? [])]),
  });
}
