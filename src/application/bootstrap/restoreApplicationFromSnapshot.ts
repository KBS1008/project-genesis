/**
 * @module @application/bootstrap/restoreApplicationFromSnapshot
 *
 * Restores a running application session from a persisted save snapshot.
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import type { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryBuildingStorageRepository } from '../../infrastructure/persistence/InMemoryBuildingStorageRepository.js';
import { InMemoryTransportOrderRepository } from '../../infrastructure/persistence/InMemoryTransportOrderRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemorySupplyContractRepository } from '../../infrastructure/persistence/InMemorySupplyContractRepository.js';
import { GameStateSerializer } from '../../infrastructure/persistence/savegame/GameStateSerializer.js';
import { FileSavegameStore } from '../../infrastructure/persistence/savegame/FileSavegameStore.js';
import { ConsoleLogger } from '../../infrastructure/logging/ConsoleLogger.js';
import type { GameSaveSnapshotV1 } from '../persistence/GameSaveSnapshotV1.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { MarketTradeService } from '../services/MarketTradeService.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { ResearchCompletionService } from '../services/ResearchCompletionService.js';
import { MilestoneEvaluationService } from '../services/MilestoneEvaluationService.js';
import { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import { EmployeeAllocationService } from '../services/EmployeeAllocationService.js';
import { TransportLogisticsService } from '../services/TransportLogisticsService.js';
import { TickHistoryService } from '../services/TickHistoryService.js';
import type { ApplicationContext } from './ApplicationContext.js';

/** Options for restoring an application session. */
export type RestoreApplicationOptions = {
  readonly gameContentRoot: string;
  readonly snapshot: GameSaveSnapshotV1;
};

/**
 * Loads validated game content and hydrates repositories from a save snapshot.
 */
export async function restoreApplicationFromSnapshot(
  options: RestoreApplicationOptions,
): Promise<Result<ApplicationContext, ContentLoadError | ValidationError>> {
  const contentResult = await validateGameContent(options.gameContentRoot);

  if (!contentResult.ok) {
    return Result.fail(contentResult.error);
  }

  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const buildingStorageRepository = new InMemoryBuildingStorageRepository();
  const transportOrderRepository = new InMemoryTransportOrderRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const marketRepository = new InMemoryMarketRepository();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const employeeRepository = new InMemoryEmployeeRepository();
  const supplyContractRepository = new InMemorySupplyContractRepository();
  const tickHistoryService = new TickHistoryService();
  const gameStateSerializer = new GameStateSerializer();
  const savegameStore = new FileSavegameStore();
  const logger = new ConsoleLogger();

  const hydrateResult = gameStateSerializer.hydrate(options.snapshot, {
    companyRepository,
    buildingRepository,
    buildingStorageRepository,
    transportOrderRepository,
    inventoryRepository,
    financeRepository,
    marketRepository,
    productionJobRepository,
    researchJobRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    employeeRepository,
    supplyContractRepository,
    tickHistoryService,
  });

  if (!hydrateResult.ok) {
    return Result.fail(hydrateResult.error);
  }

  const clock = new ManualClock(0);
  const setClockResult = clock.set(hydrateResult.value.clockTime);

  if (!setClockResult.ok) {
    return Result.fail(setClockResult.error);
  }

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

  const energyBalanceService = new EnergyBalanceService({
    buildingRepository,
    productionJobRepository,
    gameContent: contentResult.value,
  });

  const employeeAllocationService = new EmployeeAllocationService({
    employeeRepository,
    gameContent: contentResult.value,
  });

  const transportLogisticsService = new TransportLogisticsService({
    clock,
    buildingRepository,
    buildingStorageRepository,
    transportOrderRepository,
    productionJobRepository,
    inventoryRepository,
    productionInventoryService,
    gameContent: contentResult.value,
    enqueueEvents,
  });

  const marketTradeService = new MarketTradeService({
    inventoryRepository,
    financeRepository,
    marketRepository,
    clock,
    enqueueEvents,
    transportLogisticsService,
  });

  let researchCompletionService: ResearchCompletionService;

  simulationEngine = new SimulationEngine({
    clock,
    eventBus,
    tickDuration: hydrateResult.value.tickDuration,
    initialState: hydrateResult.value.simulationState,
    systems: createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
      transportOrderRepository,
      transportLogisticsService,
      productionJobRepository,
      researchJobRepository,
      financeRepository,
      inventoryRepository,
      marketRepository,
      supplyContractRepository,
      employeeRepository,
      enqueueEvents,
      onProductionJobCompleted: (job) => {
        productionInventoryService.completeJob(job);
      },
      onResearchJobCompleted: (job) => {
        researchCompletionService.completeJob(job);
      },
      energyBalanceService,
      employeeAllocationService,
      onBuildingActivated: (building) => {
        transportLogisticsService.ensureStorageForBuilding(building);
      },
    }),
  });

  researchCompletionService = new ResearchCompletionService({
    clock,
    companyRepository,
    companyResearchRepository,
    simulationEngine,
    gameContent: contentResult.value,
  });

  new MilestoneEvaluationService({
    eventBus,
    clock,
    companyMilestonesRepository,
    productionJobRepository,
    financeRepository,
    simulationEngine,
    milestones: contentResult.value.milestones,
  });

  return Result.ok({
    clock,
    eventBus,
    simulationEngine,
    companyRepository,
    buildingRepository,
    buildingStorageRepository,
    transportOrderRepository,
    inventoryRepository,
    financeRepository,
    marketRepository,
    productionJobRepository,
    researchJobRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    employeeRepository,
    supplyContractRepository,
    productionInventoryService,
    marketTradeService,
    energyBalanceService,
    transportLogisticsService,
    tickHistoryService,
    savegameStore,
    gameStateSerializer,
    logger,
    gameContent: contentResult.value,
  });
}
