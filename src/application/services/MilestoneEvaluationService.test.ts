import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { CompanyMilestoneReached } from '../../domain/milestone/events/CompanyMilestoneReached.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemorySupplyContractRepository } from '../../infrastructure/persistence/InMemorySupplyContractRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { createTransportTestServices } from '../../../tests/helpers/createTransportTestServices.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { completeBuildingConstruction } from '../../../tests/helpers/completeBuildingConstruction.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { StartProductionUseCase } from '../use-cases/StartProductionUseCase.js';
import { MarketPriceSeeder } from './MarketPriceSeeder.js';
import { MarketTradeService } from './MarketTradeService.js';
import { EnergyBalanceService } from './EnergyBalanceService.js';
import { ProductionInventoryService } from './ProductionInventoryService.js';
import { MilestoneEvaluationService } from './MilestoneEvaluationService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const { regionRepository } = bootstrapWorldFromContent(contentResult.value);

  const clock = new ManualClock(100);
  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const marketRepository = new InMemoryMarketRepository();
  const supplyContractRepository = new InMemorySupplyContractRepository();
  const employeeRepository = new InMemoryEmployeeRepository();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
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

  const transport = createTransportTestServices({
    clock,
    buildingRepository,
    productionJobRepository,
    inventoryRepository,
    productionInventoryService,
    gameContent: contentResult.value,
    enqueueEvents,
  });

  simulationEngine = new SimulationEngine({
    clock,
    eventBus,
    systems: createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
      transportOrderRepository: transport.transportOrderRepository,
      transportLogisticsService: transport.transportLogisticsService,
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
    }),
  });

  new MarketPriceSeeder({ marketRepository, clock }).seed(contentResult.value.resourceTypes);

  new MilestoneEvaluationService({
    eventBus,
    clock,
    companyMilestonesRepository,
    productionJobRepository,
    financeRepository,
    simulationEngine,
    milestones: contentResult.value.milestones,
  });

  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    simulationEngine,
  });

  const marketTradeService = new MarketTradeService({
    inventoryRepository,
    financeRepository,
    marketRepository,
    clock,
    enqueueEvents,
    transportLogisticsService: transport.transportLogisticsService,
  });

  const energyBalanceService = new EnergyBalanceService({
    buildingRepository,
    productionJobRepository,
    gameContent: contentResult.value,
  });

  return {
    clock,
    eventBus,
    companyRepository,
    inventoryRepository,
    buildingRepository,
    buildingStorageRepository: transport.buildingStorageRepository,
    transportOrderRepository: transport.transportOrderRepository,
    financeRepository,
    companyMilestonesRepository,
    createCompany,
    marketTradeService,
    energyBalanceService,
    transportLogisticsService: transport.transportLogisticsService,
    simulationEngine,
    gameContent: contentResult.value,
    productionInventoryService,
    productionJobRepository,
    companyResearchRepository,
    regionRepository,
  };
}

describe('MilestoneEvaluationService', () => {
  it('completes first_profit after the first market sale', async () => {
    const context = await createContext();
    const reached: string[] = [];

    context.eventBus.subscribe('CompanyMilestoneReached', (event) => {
      reached.push((event as CompanyMilestoneReached).milestoneId);
    });

    context.createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    inventory?.addQuantity('wood', 5, context.clock);
    context.inventoryRepository.save(inventory!);

    const sellResult = context.marketTradeService.sell(requireCompanyId('company_001'), 'wood', 2);

    expect(sellResult.ok).toBe(true);

    context.simulationEngine.tick();

    const milestones = context.companyMilestonesRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(milestones?.hasCompletedMilestone('first_profit')).toBe(true);

    context.simulationEngine.tick();
    expect(reached).toEqual(['first_profit']);
  });

  it('completes profit_100 when cumulative sale revenue reaches the threshold', async () => {
    const context = await createContext();
    const reached: string[] = [];

    context.eventBus.subscribe('CompanyMilestoneReached', (event) => {
      reached.push((event as CompanyMilestoneReached).milestoneId);
    });

    context.createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    inventory?.addQuantity('wood', 10, context.clock);
    context.inventoryRepository.save(inventory!);

    const sellResult = context.marketTradeService.sell(requireCompanyId('company_001'), 'wood', 4);

    expect(sellResult.ok).toBe(true);

    context.simulationEngine.tick();

    const milestones = context.companyMilestonesRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(milestones?.hasCompletedMilestone('profit_100')).toBe(true);

    context.simulationEngine.tick();
    expect(reached).toContain('profit_100');
  });

  it('completes first_production after the first production job finishes', async () => {
    const context = await createContext();
    const reached: string[] = [];

    context.eventBus.subscribe('CompanyMilestoneReached', (event) => {
      reached.push((event as CompanyMilestoneReached).milestoneId);
    });

    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase({
      ...context,
      gameContent: context.gameContent,
    });
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    inventory?.addQuantity('wood', 10, context.clock);
    context.inventoryRepository.save(inventory!);

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    completeBuildingConstruction({
      clock: context.clock,
      simulationEngine: context.simulationEngine,
      buildingRepository: context.buildingRepository,
      buildingId: 'building_001',
    });

    startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    context.simulationEngine.tick();
    context.clock.advance(60);
    context.simulationEngine.tick();

    const milestones = context.companyMilestonesRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(milestones?.hasCompletedMilestone('first_production')).toBe(true);

    context.simulationEngine.tick();
    expect(reached).toContain('first_production');
  });
});
