/**
 * @module @simulation/systems/company/CompanySimulationSystem
 *
 * Processes company-level simulation work each tick.
 */

import type { CompanyRepository } from '../../../domain/company/CompanyRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Visits all persisted companies during each simulation tick.
 *
 * Company-specific business rules will be added as related domain services evolve.
 */
export class CompanySimulationSystem implements SimulationSystem {
  readonly name = 'Company';
  readonly #companyRepository: CompanyRepository;

  /**
   * @param companyRepository - Repository providing access to company aggregates.
   */
  constructor(companyRepository: CompanyRepository) {
    this.#companyRepository = companyRepository;
  }

  execute(_context: TickContext): void {
    for (const _company of this.#companyRepository.findAll()) {
      // Company tick processing will be extended with finance and employee systems.
    }
  }
}
