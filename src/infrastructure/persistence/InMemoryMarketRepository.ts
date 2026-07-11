/**
 * @module @infrastructure/persistence/InMemoryMarketRepository
 *
 * In-memory implementation of {@link MarketRepository}.
 */

import type { Market } from '../../domain/market/Market.js';
import type { MarketId } from '../../domain/market/MarketId.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';

/**
 * Stores market aggregates in memory.
 */
export class InMemoryMarketRepository implements MarketRepository {
  readonly #markets = new Map<string, Market>();

  save(market: Market): void {
    this.#markets.set(market.getId().value, market);
  }

  findById(id: MarketId): Market | undefined {
    return this.#markets.get(id.value);
  }

  findAll(): readonly Market[] {
    return Object.freeze(
      [...this.#markets.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
