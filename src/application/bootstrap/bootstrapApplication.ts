/**
 * @module @application/bootstrap/bootstrapApplication
 *
 * Composes application dependencies and loads validated game content.
 */

import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { Result } from '../../common/result/Result.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import type { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import type { ApplicationContext } from './ApplicationContext.js';

/** Options for application bootstrap. */
export type BootstrapOptions = {
  readonly gameContentRoot: string;
  readonly strictContent?: boolean;
  readonly companyRepository?: CompanyRepository;
  readonly buildingRepository?: BuildingRepository;
  readonly inventoryRepository?: InventoryRepository;
  readonly financeRepository?: FinanceRepository;
  readonly productionJobRepository?: ProductionJobRepository;
};

/**
 * Loads game content and wires repositories, clock, event bus and simulation engine.
 */
export async function bootstrapApplication(
  options: BootstrapOptions,
): Promise<Result<ApplicationContext, ContentLoadError>> {
  const contentResult = await validateGameContent(options.gameContentRoot, {
    strict: options.strictContent ?? false,
  });

  if (!contentResult.ok) {
    return Result.fail(contentResult.error);
  }

  const companyRepository = options.companyRepository ?? new InMemoryCompanyRepository();
  const buildingRepository = options.buildingRepository ?? new InMemoryBuildingRepository();
  const inventoryRepository = options.inventoryRepository ?? new InMemoryInventoryRepository();
  const financeRepository = options.financeRepository ?? new InMemoryFinanceRepository();
  const productionJobRepository =
    options.productionJobRepository ?? new InMemoryProductionJobRepository();
  const clock = new ManualClock(0);
  const eventBus = new InMemoryEventBus();

  let simulationEngine: SimulationEngine;
  const enqueueEvents = (events: readonly DomainEvent[]): void => {
    simulationEngine.enqueueEvents(events);
  };

  const productionInventoryService = new ProductionInventoryService({
    inventoryRepository,
    recipes: contentResult.value.recipes,
    clock,
    enqueueEvents,
  });

  simulationEngine = new SimulationEngine({
    clock,
    eventBus,
    systems: createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
      productionJobRepository,
      financeRepository,
      enqueueEvents,
      onProductionJobCompleted: (job) => {
        productionInventoryService.completeJob(job);
      },
    }),
  });

  return Result.ok({
    clock,
    eventBus,
    simulationEngine,
    companyRepository,
    buildingRepository,
    inventoryRepository,
    financeRepository,
    productionJobRepository,
    productionInventoryService,
    gameContent: contentResult.value,
  });
}
