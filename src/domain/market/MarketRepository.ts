/**
 * @module @domain/market/MarketRepository
 *
 * Persistence contract for {@link Market} aggregate roots.
 */

import type { Market } from './Market.js';
import type { MarketId } from './MarketId.js';

/**
 * Provides access to persisted market aggregates.
 */
export interface MarketRepository {
  /** Persists a market aggregate. */
  save(market: Market): void;

  /** Returns a market by id, or undefined when not found. */
  findById(id: MarketId): Market | undefined;

  /** Returns the market for a world region, if one exists. */
  findByRegionId(regionId: string): Market | undefined;

  /** Returns all markets in deterministic id order. */
  findAll(): readonly Market[];
}
