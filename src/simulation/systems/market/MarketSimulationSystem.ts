/**
 * @module @simulation/systems/market/MarketSimulationSystem
 *
 * Processes market price tick work each simulation step.
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { InventoryRepository } from '../../../domain/inventory/InventoryRepository.js';
import { MARKET_BASELINE_DEMAND, MARKET_PRICE_UPDATE_INTERVAL_TICKS } from '../../../domain/market/MarketPriceConstants.js';
import { MarketPriceCalculator } from '../../../domain/market/MarketPriceCalculator.js';
import type { MarketRepository } from '../../../domain/market/MarketRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';
import { aggregateResourceSupply } from '../../../domain/market/MarketSupplyAggregator.js';

/** Dependencies for {@link MarketSimulationSystem}. */
export type MarketSimulationSystemDependencies = {
  readonly marketRepository: MarketRepository;
  readonly inventoryRepository: InventoryRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly baselineDemand?: number;
};

/**
 * Visits the global market during each simulation tick.
 *
 * Applies deterministic supply-and-demand price adjustments on configured intervals.
 */
export class MarketSimulationSystem implements SimulationSystem {
  readonly name = 'Market';
  readonly #marketRepository: MarketRepository;
  readonly #inventoryRepository: InventoryRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly #baselineDemand: number;

  /**
   * @param dependencies - Repositories and event enqueue callback.
   */
  constructor(dependencies: MarketSimulationSystemDependencies) {
    this.#marketRepository = dependencies.marketRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
    this.#baselineDemand = dependencies.baselineDemand ?? MARKET_BASELINE_DEMAND;
  }

  execute(context: TickContext): void {
    if (context.tickNumber % MARKET_PRICE_UPDATE_INTERVAL_TICKS !== 0) {
      return;
    }

    const inventories = this.#inventoryRepository.findAll();

    for (const market of this.#marketRepository.findAll()) {
      let changed = false;

      for (const priceEntry of market.getPrices()) {
        const resourceId = priceEntry.resourceId.value;
        const totalSupply = aggregateResourceSupply(inventories, resourceId);
        const nextPrice = MarketPriceCalculator.computeNextPrice({
          lastPrice: priceEntry.lastPrice,
          basePrice: priceEntry.basePrice,
          totalSupply,
          baselineDemand: this.#baselineDemand,
        });

        if (nextPrice === priceEntry.lastPrice) {
          continue;
        }

        const updateResult = market.updateLastPrice(resourceId, nextPrice, 0, context.clock);

        if (updateResult.ok) {
          changed = true;
        }
      }

      if (changed) {
        this.#marketRepository.save(market);
        this.#enqueueEvents(market.pullDomainEvents());
      }
    }
  }
}
