import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { ProductionCompleted } from '../../domain/production/events/ProductionCompleted.js';
import { ProductionStarted } from '../../domain/production/events/ProductionStarted.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import { ResearchCompletionService } from '../services/ResearchCompletionService.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { createTransportTestServices } from '../../../tests/helpers/createTransportTestServices.js';
import { completeBuildingConstruction } from '../../../tests/helpers/completeBuildingConstruction.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';
import { StartProductionUseCase } from './StartProductionUseCase.js';
import { StartResearchUseCase } from './StartResearchUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function createContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const marketRepository = new InMemoryMarketRepository();
  const employeeRepository = new InMemoryEmployeeRepository();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
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

  let researchCompletionService: ResearchCompletionService;

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
      marketRepository,
      employeeRepository,
      enqueueEvents,
      onProductionJobCompleted: (job) => {
        productionInventoryService.completeJob(job);
      },
      onResearchJobCompleted: (job) => {
        researchCompletionService.completeJob(job);
      },
      onBuildingActivated: (building) => {
        transport.transportLogisticsService.ensureStorageForBuilding(building);
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

  const energyBalanceService = new EnergyBalanceService({
    buildingRepository,
    productionJobRepository,
    gameContent: contentResult.value,
  });

  return {
    clock,
    eventBus,
    companyRepository,
    buildingRepository,
    buildingStorageRepository: transport.buildingStorageRepository,
    transportOrderRepository: transport.transportOrderRepository,
    inventoryRepository,
    financeRepository,
    productionJobRepository,
    researchJobRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    productionInventoryService,
    energyBalanceService,
    transportLogisticsService: transport.transportLogisticsService,
    simulationEngine,
    gameContent: contentResult.value,
  };
}

function addWoodStock(
  context: Awaited<ReturnType<typeof createContext>>,
  companyId: string,
  amount: number,
) {
  const companyIdResult = createCompanyId(companyId);

  if (!companyIdResult.ok) {
    throw new Error(companyIdResult.error.message);
  }

  const inventory = context.inventoryRepository.findByCompanyId(companyIdResult.value);

  if (inventory === undefined) {
    throw new Error(`Inventory for company "${companyId}" was not found.`);
  }

  inventory.addQuantity('wood', amount, context.clock);
  context.inventoryRepository.save(inventory);
  inventory.pullDomainEvents();
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function grantFirstProfit(
  context: Awaited<ReturnType<typeof createContext>>,
  companyId: string,
) {
  const companyIdResult = createCompanyId(companyId);

  if (!companyIdResult.ok) {
    throw new Error(companyIdResult.error.message);
  }

  const milestones = context.companyMilestonesRepository.findByCompanyId(companyIdResult.value);

  if (milestones === undefined) {
    throw new Error(`Milestones for company "${companyId}" were not found.`);
  }

  const milestoneIdResult = createMilestoneId('first_profit');

  if (!milestoneIdResult.ok) {
    throw new Error(milestoneIdResult.error.message);
  }

  milestones.completeMilestone(milestoneIdResult.value, context.clock);
  context.companyMilestonesRepository.save(milestones);
}

function grantMilestone(
  context: Awaited<ReturnType<typeof createContext>>,
  companyId: string,
  milestoneId: string,
) {
  const companyIdResult = createCompanyId(companyId);

  if (!companyIdResult.ok) {
    throw new Error(companyIdResult.error.message);
  }

  const milestones = context.companyMilestonesRepository.findByCompanyId(companyIdResult.value);

  if (milestones === undefined) {
    throw new Error(`Milestones for company "${companyId}" were not found.`);
  }

  const milestoneIdResult = createMilestoneId(milestoneId);

  if (!milestoneIdResult.ok) {
    throw new Error(milestoneIdResult.error.message);
  }

  milestones.completeMilestone(milestoneIdResult.value, context.clock);
  context.companyMilestonesRepository.save(milestones);
}

function activateBuilding(
  context: Awaited<ReturnType<typeof createContext>>,
  buildingId: string,
) {
  completeBuildingConstruction({
    clock: context.clock,
    simulationEngine: context.simulationEngine,
    buildingRepository: context.buildingRepository,
    buildingId,
  });
}

describe('StartProductionUseCase', () => {
  it('starts a production job for a valid building and recipe', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    addWoodStock(context, 'company_001', 10);

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });
    activateBuilding(context, 'building_001');

    const result = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const job = context.productionJobRepository.findById(result.value);
      expect(job?.getRecipeId().value).toBe('recipe_planks');
    }
  });

  it('rejects production when required inputs are unavailable', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });
    activateBuilding(context, 'building_001');

    const result = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    expect(result.ok).toBe(false);
  });

  it('publishes production events and transfers inventory when the job completes', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);
    const started: string[] = [];
    const completed: string[] = [];

    context.eventBus.subscribe('ProductionStarted', (event) => {
      started.push((event as ProductionStarted).jobId);
    });
    context.eventBus.subscribe('ProductionCompleted', (event) => {
      completed.push((event as ProductionCompleted).jobId);
    });

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    addWoodStock(context, 'company_001', 10);

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });
    activateBuilding(context, 'building_001');

    startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    context.simulationEngine.tick();
    expect(started).toEqual(['job_001']);

    context.clock.advance(60);
    context.simulationEngine.tick();
    expect(completed).toEqual(['job_001']);

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');
    const planks = inventory?.getItems().find((item) => item.resourceId.value === 'planks');

    expect(wood).toBeUndefined();
    expect(planks?.quantity).toBe(20);
  });

  it('rejects recipes that do not match the building type', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    addWoodStock(context, 'company_001', 10);
    grantFirstProfit(context, 'company_001');

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Main Warehouse',
      x: 0,
      y: 0,
    });
    activateBuilding(context, 'building_001');

    const result = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    expect(result.ok).toBe(false);
  });

  it('rejects recipes when required research is not completed', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    addWoodStock(context, 'company_001', 10);

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });
    activateBuilding(context, 'building_001');

    const blockedResult = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_advanced_planks',
    });

    expect(blockedResult.ok).toBe(false);

    grantMilestone(context, 'company_001', 'profit_100');

    const completeTechnology = new StartResearchUseCase(context);
    const completeResult = completeTechnology.execute({
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(completeResult.ok).toBe(true);

    context.clock.advance(60);
    context.simulationEngine.tick();

    grantMilestone(context, 'company_001', 'first_production');

    const allowedResult = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_advanced_planks',
    });

    expect(allowedResult.ok).toBe(true);
  });

  it('rejects advanced recipes when required milestones are not completed', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);
    const startResearch = new StartResearchUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    addWoodStock(context, 'company_001', 10);
    grantMilestone(context, 'company_001', 'profit_100');

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });
    activateBuilding(context, 'building_001');

    startResearch.execute({
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    context.clock.advance(60);
    context.simulationEngine.tick();

    const blockedResult = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_advanced_planks',
    });

    expect(blockedResult.ok).toBe(false);
  });
});

describe('StartProductionUseCase construction guard', () => {
  it('rejects production when the building is still under construction', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    addWoodStock(context, 'company_001', 10);

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    const result = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toBe('Building id "building_001" is not active yet.');
    }
  });
});
