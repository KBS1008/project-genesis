import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { ProductionCompleted } from '../../domain/production/events/ProductionCompleted.js';
import { ProductionStarted } from '../../domain/production/events/ProductionStarted.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';
import { StartProductionUseCase } from './StartProductionUseCase.js';

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
  const productionJobRepository = new InMemoryProductionJobRepository();
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
      marketRepository,
      enqueueEvents,
      onProductionJobCompleted: (job) => {
        productionInventoryService.completeJob(job);
      },
    }),
  });

  return {
    clock,
    eventBus,
    companyRepository,
    buildingRepository,
    inventoryRepository,
    financeRepository,
    productionJobRepository,
    productionInventoryService,
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

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Main Warehouse',
      x: 0,
      y: 0,
    });

    const result = startProduction.execute({
      jobId: 'job_001',
      buildingId: 'building_001',
      recipeId: 'recipe_planks',
    });

    expect(result.ok).toBe(false);
  });
});
