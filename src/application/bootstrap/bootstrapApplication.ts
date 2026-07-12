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
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { MarketTradeService } from '../services/MarketTradeService.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { ResearchCompletionService } from '../services/ResearchCompletionService.js';
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
  readonly marketRepository?: MarketRepository;
  readonly productionJobRepository?: ProductionJobRepository;
  readonly researchJobRepository?: ResearchJobRepository;
  readonly companyResearchRepository?: CompanyResearchRepository;
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
  const marketRepository = options.marketRepository ?? new InMemoryMarketRepository();
  const productionJobRepository =
    options.productionJobRepository ?? new InMemoryProductionJobRepository();
  const researchJobRepository =
    options.researchJobRepository ?? new InMemoryResearchJobRepository();
  const companyResearchRepository =
    options.companyResearchRepository ?? new InMemoryCompanyResearchRepository();
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

  const marketTradeService = new MarketTradeService({
    inventoryRepository,
    financeRepository,
    marketRepository,
    clock,
    enqueueEvents,
  });

  let researchCompletionService: ResearchCompletionService;

  simulationEngine = new SimulationEngine({
    clock,
    eventBus,
    systems: createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
      productionJobRepository,
      researchJobRepository,
      financeRepository,
      marketRepository,
      enqueueEvents,
      onProductionJobCompleted: (job) => {
        productionInventoryService.completeJob(job);
      },
      onResearchJobCompleted: (job) => {
        researchCompletionService.completeJob(job);
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

  return Result.ok({
    clock,
    eventBus,
    simulationEngine,
    companyRepository,
    buildingRepository,
    inventoryRepository,
    financeRepository,
    marketRepository,
    productionJobRepository,
    researchJobRepository,
    companyResearchRepository,
    productionInventoryService,
    marketTradeService,
    gameContent: contentResult.value,
  });
}
