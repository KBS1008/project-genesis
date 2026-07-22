/**
 * @module @simulation/systems/company/CompanyPlanningSystem
 *
 * Runs deterministic company planning after market state is updated each tick.
 */

import type { CompanyPlanningPort } from '../../../domain/brain/CompanyPlanningPort.js';
import type { CompanyBrainRepository } from '../../../domain/brain/CompanyBrainRepository.js';
import type { CompanyRepository } from '../../../domain/company/CompanyRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link CompanyPlanningSystem}. */
export type CompanyPlanningSystemDependencies = {
  readonly companyRepository: CompanyRepository;
  readonly companyBrainRepository?: CompanyBrainRepository;
  readonly companyPlanningPort?: CompanyPlanningPort;
};

/**
 * Executes the planning pipeline for every company that owns a brain aggregate.
 */
export class CompanyPlanningSystem implements SimulationSystem {
  readonly name = 'CompanyPlanning';
  readonly #companyRepository: CompanyRepository;
  readonly #companyBrainRepository: CompanyBrainRepository | undefined;
  readonly #companyPlanningPort: CompanyPlanningPort | undefined;

  constructor(dependencies: CompanyPlanningSystemDependencies) {
    this.#companyRepository = dependencies.companyRepository;
    this.#companyBrainRepository = dependencies.companyBrainRepository;
    this.#companyPlanningPort = dependencies.companyPlanningPort;
  }

  execute(context: TickContext): void {
    if (this.#companyBrainRepository === undefined || this.#companyPlanningPort === undefined) {
      return;
    }

    for (const company of this.#companyRepository.findAll()) {
      const brain = this.#companyBrainRepository.findByCompanyId(company.getId());

      if (brain === undefined) {
        continue;
      }

      this.#companyPlanningPort.run(company.getId(), context.tickNumber);
    }
  }
}
