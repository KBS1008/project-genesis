/**
 * @module @simulation/systems/company/CompanySimulationSystem
 *
 * Processes company-level simulation work each tick.
 *
 * Phase 1 (Core Domain): intentional no-op stub. The system is wired into the
 * default simulation pipeline so future per-tick company rules can plug in
 * without bootstrap changes. Bankruptcy, vacation mode, and world/region
 * coupling are deferred to M7+ — see `src/domain/company/README.md`.
 */

import type { CompanyRepository } from '../../../domain/company/CompanyRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Visits all persisted companies during each simulation tick.
 *
 * Phase 1: no domain mutations — iteration placeholder only.
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
      // Phase 1 no-op: per-tick company rules arrive with M7 domain extensions.
    }
  }
}
