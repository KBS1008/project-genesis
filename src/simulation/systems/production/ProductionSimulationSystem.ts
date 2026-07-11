/**
 * @module @simulation/systems/production/ProductionSimulationSystem
 *
 * Placeholder for recipe-based production tick processing.
 *
 * @see docs/decisions/DD-011-recipe-based-production.md
 */

import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Reserved simulation system for production execution.
 *
 * Will process {@link ProductionJob} aggregates once the production domain exists.
 */
export class ProductionSimulationSystem implements SimulationSystem {
  readonly name = 'Production';

  execute(_context: TickContext): void {
    // Production tick processing requires ProductionJob and Inventory aggregates.
  }
}
