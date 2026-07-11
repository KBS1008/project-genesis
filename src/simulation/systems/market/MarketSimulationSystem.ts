/**
 * @module @simulation/systems/market/MarketSimulationSystem
 *
 * Placeholder for market price and trade tick processing.
 */

import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Reserved simulation system for market updates.
 *
 * Will process market aggregates once the market domain exists.
 */
export class MarketSimulationSystem implements SimulationSystem {
  readonly name = 'Market';

  execute(_context: TickContext): void {
    // Market tick processing requires market domain aggregates.
  }
}
