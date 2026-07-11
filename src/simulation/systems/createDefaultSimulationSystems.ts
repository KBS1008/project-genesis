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
import { FinanceSimulationSystem } from './finance/FinanceSimulationSystem.js';
import { MarketSimulationSystem } from './market/MarketSimulationSystem.js';
import { ProductionSimulationSystem } from './production/ProductionSimulationSystem.js';
import type { SimulationSystemDependencies } from './SimulationSystemDependencies.js';

/**
 * Creates the default simulation systems in deterministic runtime order.
 *
 * Order: Company → Building → Production → Market → Finance
 */
export function createDefaultSimulationSystems(
  dependencies: SimulationSystemDependencies,
): readonly SimulationSystem[] {
  return Object.freeze([
    new CompanySimulationSystem(dependencies.companyRepository),
    new BuildingSimulationSystem(dependencies.companyRepository, dependencies.buildingRepository),
    new ProductionSimulationSystem({
      productionJobRepository: dependencies.productionJobRepository,
      enqueueEvents: dependencies.enqueueEvents,
      ...(dependencies.onProductionJobCompleted !== undefined
        ? { onJobCompleted: dependencies.onProductionJobCompleted }
        : {}),
    }),
    new MarketSimulationSystem(),
    new FinanceSimulationSystem(dependencies.financeRepository),
  ]);
}
