/**
 * @module @domain/market/ResourceMarketPrice
 *
 * Immutable snapshot of one resource price line in the market.
 */

import type { ResourceTypeId } from '../shared/ResourceTypeId.js';

/** One resource price entry within a market aggregate. */
export type ResourceMarketPrice = {
  readonly resourceId: ResourceTypeId;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;
  readonly updatedAt: number;
};
