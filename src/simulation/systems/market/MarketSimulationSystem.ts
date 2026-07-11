/**
 * @module @simulation/systems/market/MarketSimulationSystem
 *
 * Processes market price tick work each simulation step.
 */

import type { MarketRepository } from '../../../domain/market/MarketRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Visits the global market during each simulation tick.
 *
 * Dynamic price updates and order matching will be added in later increments.
 */
export class MarketSimulationSystem implements SimulationSystem {
  readonly name = 'Market';
  readonly #marketRepository: MarketRepository;

  /**
   * @param marketRepository - Repository providing access to market aggregates.
   */
  constructor(marketRepository: MarketRepository) {
    this.#marketRepository = marketRepository;
  }

  execute(_context: TickContext): void {
    for (const _market of this.#marketRepository.findAll()) {
      // Market tick processing will be extended with supply/demand price updates.
    }
  }
}
