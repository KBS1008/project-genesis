/**
 * @module @simulation/systems/finance/FinanceSimulationSystem
 *
 * Placeholder for company finance tick processing.
 */

import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Reserved simulation system for finance updates.
 *
 * Will process finance aggregates once the finance domain exists.
 */
export class FinanceSimulationSystem implements SimulationSystem {
  readonly name = 'Finance';

  execute(_context: TickContext): void {
    // Finance tick processing requires finance domain aggregates.
  }
}
