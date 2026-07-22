/**
 * @module @simulation/systems/createDefaultSimulationSystems
 *
 * Builds the default deterministic simulation system pipeline.
 *
 * @see docs/architecture/runtime-view.md
 */

import type { SimulationSystem } from '../engine/SimulationSystem.js';
import { BuildingSimulationSystem } from './building/BuildingSimulationSystem.js';
import { CompanySimulationSystem } from './company/CompanySimulationSystem.js';
import { CompanyPlanningSystem } from './company/CompanyPlanningSystem.js';
import { ContractSimulationSystem } from './contract/ContractSimulationSystem.js';
import { FinanceSimulationSystem } from './finance/FinanceSimulationSystem.js';
import { MarketSimulationSystem } from './market/MarketSimulationSystem.js';
import { ProductionSimulationSystem } from './production/ProductionSimulationSystem.js';
import { ResearchSimulationSystem } from './research/ResearchSimulationSystem.js';
import { TransportSimulationSystem } from './transport/TransportSimulationSystem.js';
import type { SimulationSystemDependencies } from './SimulationSystemDependencies.js';

/**
 * Creates the default simulation systems in deterministic runtime order.
 *
 * Order: Company → Building → Transport → Production → Research → Market → CompanyPlanning → Contract → Finance
 */
export function createDefaultSimulationSystems(
  dependencies: SimulationSystemDependencies,
): readonly SimulationSystem[] {
  return Object.freeze([
    new CompanySimulationSystem({
      companyRepository: dependencies.companyRepository,
      ...(dependencies.companyBrainRepository !== undefined
        ? { companyBrainRepository: dependencies.companyBrainRepository }
        : {}),
      ...(dependencies.companyDecisionExecutionPort !== undefined
        ? { companyDecisionExecutionPort: dependencies.companyDecisionExecutionPort }
        : {}),
    }),
    new BuildingSimulationSystem({
      buildingRepository: dependencies.buildingRepository,
      enqueueEvents: dependencies.enqueueEvents,
      ...(dependencies.onBuildingActivated !== undefined
        ? { onBuildingActivated: dependencies.onBuildingActivated }
        : {}),
    }),
    new TransportSimulationSystem({
      transportOrderRepository: dependencies.transportOrderRepository,
      transportLogisticsService: dependencies.transportLogisticsService,
      enqueueEvents: dependencies.enqueueEvents,
    }),
    new ProductionSimulationSystem({
      productionJobRepository: dependencies.productionJobRepository,
      enqueueEvents: dependencies.enqueueEvents,
      ...(dependencies.onProductionJobCompleted !== undefined
        ? { onJobCompleted: dependencies.onProductionJobCompleted }
        : {}),
      ...(dependencies.energyBalanceService !== undefined
        ? { energyBalanceService: dependencies.energyBalanceService }
        : {}),
      ...(dependencies.employeeAllocationService !== undefined
        ? { employeeAllocationService: dependencies.employeeAllocationService }
        : {}),
    }),
    new ResearchSimulationSystem({
      researchJobRepository: dependencies.researchJobRepository,
      enqueueEvents: dependencies.enqueueEvents,
      ...(dependencies.onResearchJobCompleted !== undefined
        ? { onJobCompleted: dependencies.onResearchJobCompleted }
        : {}),
    }),
    new MarketSimulationSystem({
      marketRepository: dependencies.marketRepository,
      buildingRepository: dependencies.buildingRepository,
      buildingStorageRepository: dependencies.buildingStorageRepository,
      enqueueEvents: dependencies.enqueueEvents,
    }),
    new CompanyPlanningSystem({
      companyRepository: dependencies.companyRepository,
      ...(dependencies.companyBrainRepository !== undefined
        ? { companyBrainRepository: dependencies.companyBrainRepository }
        : {}),
      ...(dependencies.companyPlanningPort !== undefined
        ? { companyPlanningPort: dependencies.companyPlanningPort }
        : {}),
    }),
    new ContractSimulationSystem({
      supplyContractRepository: dependencies.supplyContractRepository,
      inventoryRepository: dependencies.inventoryRepository,
      financeRepository: dependencies.financeRepository,
      enqueueEvents: dependencies.enqueueEvents,
    }),
    new FinanceSimulationSystem({
      financeRepository: dependencies.financeRepository,
      employeeRepository: dependencies.employeeRepository,
      enqueueEvents: dependencies.enqueueEvents,
    }),
  ]);
}
