/**
 * @module @domain/market/MarketPriceHistoryEntry
 *
 * Immutable historical price observation for a regional market resource.
 */

/** One deterministic market history snapshot for a resource at a tick. */
export type MarketPriceHistoryEntry = {
  readonly tick: number;
  readonly resourceId: string;
  readonly price: number;
  readonly tradeVolume: number;
  readonly supply: number;
  readonly demand: number;
  readonly liquidity: number;
};

/** Maximum number of history entries retained per regional market. */
export const MARKET_PRICE_HISTORY_LIMIT = 100;

/** Creates a frozen market price history entry. */
export function createMarketPriceHistoryEntry(
  entry: MarketPriceHistoryEntry,
): MarketPriceHistoryEntry {
  return Object.freeze({ ...entry });
}
