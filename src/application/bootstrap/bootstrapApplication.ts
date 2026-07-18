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
import { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { BuildingStorageRepository } from '../../domain/building/BuildingStorageRepository.js';
import type { TransportOrderRepository } from '../../domain/transport/TransportOrderRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';
import type { EmployeeRepository } from '../../domain/employee/EmployeeRepository.js';
import type { SupplyContractRepository } from '../../domain/contract/SupplyContractRepository.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryBuildingStorageRepository } from '../../infrastructure/persistence/InMemoryBuildingStorageRepository.js';
import { InMemoryTransportOrderRepository } from '../../infrastructure/persistence/InMemoryTransportOrderRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemorySupplyContractRepository } from '../../infrastructure/persistence/InMemorySupplyContractRepository.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { MarketTradeService } from '../services/MarketTradeService.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { ResearchCompletionService } from '../services/ResearchCompletionService.js';
import { MilestoneEvaluationService } from '../services/MilestoneEvaluationService.js';
import { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import { EmployeeAllocationService } from '../services/EmployeeAllocationService.js';
import { TransportLogisticsService } from '../services/TransportLogisticsService.js';
import { TickHistoryService } from '../services/TickHistoryService.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { FileSavegameStore } from '../../infrastructure/persistence/savegame/FileSavegameStore.js';
import { GameStateSerializer } from '../../infrastructure/persistence/savegame/GameStateSerializer.js';
import { ConsoleLogger } from '../../infrastructure/logging/ConsoleLogger.js';
import { LogCategory } from '../../common/logging/LogCategory.js';
import type { ApplicationContext } from './ApplicationContext.js';

/** Options for application bootstrap. */
export type BootstrapOptions = {
  readonly gameContentRoot: string;
  readonly strictContent?: boolean;
  readonly companyRepository?: CompanyRepository;
  readonly buildingRepository?: BuildingRepository;
  readonly buildingStorageRepository?: BuildingStorageRepository;
  readonly transportOrderRepository?: TransportOrderRepository;
  readonly inventoryRepository?: InventoryRepository;
  readonly financeRepository?: FinanceRepository;
  readonly marketRepository?: MarketRepository;
  readonly productionJobRepository?: ProductionJobRepository;
  readonly researchJobRepository?: ResearchJobRepository;
  readonly companyResearchRepository?: CompanyResearchRepository;
  readonly companyMilestonesRepository?: CompanyMilestonesRepository;
  readonly employeeRepository?: EmployeeRepository;
  readonly supplyContractRepository?: SupplyContractRepository;
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
  const buildingStorageRepository =
    options.buildingStorageRepository ?? new InMemoryBuildingStorageRepository();
  const transportOrderRepository =
    options.transportOrderRepository ?? new InMemoryTransportOrderRepository();
  const inventoryRepository = options.inventoryRepository ?? new InMemoryInventoryRepository();
  const financeRepository = options.financeRepository ?? new InMemoryFinanceRepository();
  const marketRepository = options.marketRepository ?? new InMemoryMarketRepository();
  const productionJobRepository =
    options.productionJobRepository ?? new InMemoryProductionJobRepository();
  const researchJobRepository =
    options.researchJobRepository ?? new InMemoryResearchJobRepository();
  const companyResearchRepository =
    options.companyResearchRepository ?? new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository =
    options.companyMilestonesRepository ?? new InMemoryCompanyMilestonesRepository();
  const employeeRepository = options.employeeRepository ?? new InMemoryEmployeeRepository();
  const supplyContractRepository =
    options.supplyContractRepository ?? new InMemorySupplyContractRepository();
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

  const marketPriceSeeder = new MarketPriceSeeder({
    marketRepository,
    clock,
  });
  const seedMarketResult = marketPriceSeeder.seed(contentResult.value.resourceTypes);

  if (!seedMarketResult.ok) {
    return Result.fail(
      new ContentLoadError(seedMarketResult.error.message, {
        contentId: 'market_global',
      }),
    );
  }

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

  const tickHistoryService = new TickHistoryService();
  const savegameStore = new FileSavegameStore();
  const gameStateSerializer = new GameStateSerializer();
  const logger = new ConsoleLogger();

  logger.info(LogCategory.Application, 'Application bootstrap completed.', {
    resources: contentResult.value.resourceTypes.size,
    buildingTypes: contentResult.value.buildingTypes.size,
    employees: contentResult.value.employees.size,
    recipes: contentResult.value.recipes.size,
    tickNumber: simulationEngine.state.tickNumber,
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
