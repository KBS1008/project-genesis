/**
 * @module @simulation/systems/SimulationSystemDependencies
 *
 * Dependencies required to construct default simulation systems.
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import type { ProductionJobCompletedHandler } from './production/ProductionJobCompletedHandler.js';
import type { ResearchJobCompletedHandler } from './research/ResearchJobCompletedHandler.js';
import type { EnergyBalanceService } from '../../application/services/EnergyBalanceService.js';

/** Repository dependencies for simulation systems. */
export type SimulationSystemDependencies = {
  readonly companyRepository: CompanyRepository;
  readonly buildingRepository: BuildingRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly researchJobRepository: ResearchJobRepository;
  readonly financeRepository: FinanceRepository;
  readonly marketRepository: MarketRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly onProductionJobCompleted?: ProductionJobCompletedHandler;
  readonly onResearchJobCompleted?: ResearchJobCompletedHandler;
  readonly energyBalanceService?: EnergyBalanceService;
};
