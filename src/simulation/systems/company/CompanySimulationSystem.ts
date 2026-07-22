/**
 * @module @simulation/systems/company/CompanySimulationSystem
 *
 * Processes company-level simulation work each tick.
 *
 * M8 executes queued company decisions at the start of the tick pipeline so
 * trades use the latest persisted market prices from the previous tick.
 */

import type { CompanyDecisionExecutionPort } from '../../../domain/brain/CompanyDecisionExecutionPort.js';
import type { CompanyBrainRepository } from '../../../domain/brain/CompanyBrainRepository.js';
import type { CompanyRepository } from '../../../domain/company/CompanyRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link CompanySimulationSystem}. */
export type CompanySimulationSystemDependencies = {
  readonly companyRepository: CompanyRepository;
  readonly companyBrainRepository?: CompanyBrainRepository;
  readonly companyDecisionExecutionPort?: CompanyDecisionExecutionPort;
};

/**
 * Visits all persisted companies during each simulation tick.
 */
export class CompanySimulationSystem implements SimulationSystem {
  readonly name = 'Company';
  readonly #companyRepository: CompanyRepository;
  readonly #companyBrainRepository: CompanyBrainRepository | undefined;
  readonly #companyDecisionExecutionPort: CompanyDecisionExecutionPort | undefined;

  constructor(dependencies: CompanySimulationSystemDependencies) {
    this.#companyRepository = dependencies.companyRepository;
    this.#companyBrainRepository = dependencies.companyBrainRepository;
    this.#companyDecisionExecutionPort = dependencies.companyDecisionExecutionPort;
  }

  execute(_context: TickContext): void {
    if (
      this.#companyBrainRepository === undefined ||
      this.#companyDecisionExecutionPort === undefined
    ) {
      return;
    }

    for (const company of this.#companyRepository.findAll()) {
      const brain = this.#companyBrainRepository.findByCompanyId(company.getId());

      if (brain === undefined) {
        continue;
      }

      this.#companyDecisionExecutionPort.executePendingDecisions(company.getId());
    }
  }
}
