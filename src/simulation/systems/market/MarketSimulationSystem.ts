/**
 * @module @simulation/systems/market/MarketSimulationSystem
 *
 * Processes regional market price tick work each simulation step.
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { BuildingRepository } from '../../../domain/building/BuildingRepository.js';
import type { BuildingStorageRepository } from '../../../domain/building/BuildingStorageRepository.js';
import {
  MARKET_BASELINE_DEMAND,
  MARKET_PRICE_ADJUSTMENT_RATE,
  MARKET_PRICE_UPDATE_INTERVAL_TICKS,
} from '../../../domain/market/MarketPriceConstants.js';
import { InflationCalculator } from '../../../domain/market/InflationCalculator.js';
import { MarketPriceCalculator } from '../../../domain/market/MarketPriceCalculator.js';
import { aggregateRegionalResourceSupply } from '../../../domain/market/MarketRegionalSupplyAggregator.js';
import type { MarketRepository } from '../../../domain/market/MarketRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link MarketSimulationSystem}. */
export type MarketSimulationSystemDependencies = {
  readonly marketRepository: MarketRepository;
  readonly buildingRepository: BuildingRepository;
  readonly buildingStorageRepository: BuildingStorageRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly baselineDemand?: number;
};

/**
 * Visits all regional markets during each simulation tick.
 *
 * Applies deterministic supply-and-demand price adjustments on configured intervals.
 */
export class MarketSimulationSystem implements SimulationSystem {
  readonly name = 'Market';
  readonly #marketRepository: MarketRepository;
  readonly #buildingRepository: BuildingRepository;
  readonly #buildingStorageRepository: BuildingStorageRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly #baselineDemand: number;

  /**
   * @param dependencies - Repositories and event enqueue callback.
   */
  constructor(dependencies: MarketSimulationSystemDependencies) {
    this.#marketRepository = dependencies.marketRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#buildingStorageRepository = dependencies.buildingStorageRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
    this.#baselineDemand = dependencies.baselineDemand ?? MARKET_BASELINE_DEMAND;
  }

  execute(context: TickContext): void {
    if (context.tickNumber % MARKET_PRICE_UPDATE_INTERVAL_TICKS !== 0) {
      return;
    }

    const buildings = this.#buildingRepository.findAll();
    const buildingStorages = buildings.flatMap((building) => {
      const storage = this.#buildingStorageRepository.findByBuildingId(building.getId());

      return storage === undefined ? [] : [storage];
    });

    for (const market of this.#marketRepository.findAll()) {
      let changed = false;
      const regionId = market.getRegionId();
      const priceIndex = InflationCalculator.computePriceIndexFromMarketPrices(market.getPrices());
      const adjustmentRate =
        MARKET_PRICE_ADJUSTMENT_RATE * InflationCalculator.computeAdjustmentMultiplier(priceIndex);

      for (const priceEntry of market.getPrices()) {
        const resourceId = priceEntry.resourceId.value;
        const regionalSupply = aggregateRegionalResourceSupply(
          buildings,
          buildingStorages,
          regionId,
          resourceId,
        );
        const totalSupply = regionalSupply;
        const totalDemand = this.#baselineDemand;

        market.updateSupplyDemand(resourceId, totalSupply, totalDemand, context.clock);

        const nextPrice = MarketPriceCalculator.computeNextPrice({
          lastPrice: priceEntry.lastPrice,
          basePrice: priceEntry.basePrice,
          totalSupply,
          baselineDemand: totalDemand,
          adjustmentRate,
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
