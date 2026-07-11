/**
 * @module @application/read-models/MarketPriceReadModel
 *
 * Read-side projection of one resource market price.
 */

/** Immutable market price data returned by queries. */
export type MarketPriceReadModel = {
  readonly resourceId: string;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;
  readonly updatedAt: number;
};
