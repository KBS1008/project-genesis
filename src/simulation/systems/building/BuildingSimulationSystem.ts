/**
 * @module @simulation/systems/building/BuildingSimulationSystem
 *
 * Processes building-level simulation work each tick.
 */

import type { BuildingRepository } from '../../../domain/building/BuildingRepository.js';
import type { CompanyRepository } from '../../../domain/company/CompanyRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/**
 * Visits all persisted buildings during each simulation tick.
 *
 * Building maintenance and capacity updates will be added with related domain rules.
 */
export class BuildingSimulationSystem implements SimulationSystem {
  readonly name = 'Building';
  readonly #companyRepository: CompanyRepository;
  readonly #buildingRepository: BuildingRepository;

  /**
   * @param companyRepository - Repository used to enumerate companies.
   * @param buildingRepository - Repository providing access to building aggregates.
   */
  constructor(companyRepository: CompanyRepository, buildingRepository: BuildingRepository) {
    this.#companyRepository = companyRepository;
    this.#buildingRepository = buildingRepository;
  }

  execute(_context: TickContext): void {
    for (const company of this.#companyRepository.findAll()) {
      for (const _building of this.#buildingRepository.findByCompanyId(company.getId())) {
        // Building tick processing will be extended with maintenance and capacity rules.
      }
    }
  }
}
