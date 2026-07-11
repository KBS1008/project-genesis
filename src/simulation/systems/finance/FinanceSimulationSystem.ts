/**
 * @module @simulation/systems/finance/FinanceSimulationSystem
 *
 * Processes company finance tick work each tick.
 */

import type { FinanceRepository } from '../../../domain/finance/FinanceRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Visits all persisted finance accounts during each simulation tick.
 *
 * Recurring finance rules such as maintenance and salaries will be added later.
 */
export class FinanceSimulationSystem implements SimulationSystem {
  readonly name = 'Finance';
  readonly #financeRepository: FinanceRepository;

  /**
   * @param financeRepository - Repository providing access to finance aggregates.
   */
  constructor(financeRepository: FinanceRepository) {
    this.#financeRepository = financeRepository;
  }

  execute(_context: TickContext): void {
    for (const _account of this.#financeRepository.findAll()) {
      // Finance tick processing will be extended with maintenance and market settlement.
    }
  }
}
