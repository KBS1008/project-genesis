/**
 * @module @domain/market/MarketConstants
 *
 * Shared market defaults for Project Genesis.
 */

/** Identifier used for the legacy global market price book in save V2. */
export const GLOBAL_MARKET_ID = 'market_global';

/** Creates the deterministic market id for a world region. */
export function createRegionalMarketId(regionId: string): string {
  return `market_${regionId}`;
}
