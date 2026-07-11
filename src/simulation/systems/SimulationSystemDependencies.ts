/**
 * @module @simulation/systems/SimulationSystemDependencies
 *
 * Dependencies required to construct default simulation systems.
 */

import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';

/** Repository dependencies for simulation systems. */
export type SimulationSystemDependencies = {
  readonly companyRepository: CompanyRepository;
  readonly buildingRepository: BuildingRepository;
};
