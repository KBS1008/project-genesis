import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { ProductionCompleted } from '../../domain/production/events/ProductionCompleted.js';
import { ProductionStarted } from '../../domain/production/events/ProductionStarted.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
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
  const productionJobRepository = new InMemoryProductionJobRepository();
  const eventBus = new InMemoryEventBus();

  let simulationEngine: SimulationEngine;
  const enqueueEvents = (events: readonly DomainEvent[]): void => {
    simulationEngine.enqueueEvents(events);
  };

  simulationEngine = new SimulationEngine({
    clock,
    eventBus,
    systems: createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
      productionJobRepository,
      enqueueEvents,
    }),
  });

  return {
    clock,
    eventBus,
    companyRepository,
    buildingRepository,
    inventoryRepository,
    productionJobRepository,
    simulationEngine,
    gameContent: contentResult.value,
  };
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

  it('publishes production events and completes the job after simulation ticks', async () => {
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
