import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import type { BuildingPlaced } from '../../domain/building/events/BuildingPlaced.js';
import type { BuildingConstructionCompleted } from '../../domain/building/events/BuildingConstructionCompleted.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
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
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireBuildingId(value: string) {
  const result = createBuildingId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createContext(clock = new ManualClock(100)) {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const { regionRepository } = bootstrapWorldFromContent(contentResult.value);

  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
  const marketRepository = new InMemoryMarketRepository();
  const supplyContractRepository = new InMemorySupplyContractRepository();
  const employeeRepository = new InMemoryEmployeeRepository();

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
    }),
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
  const placeBuilding = new PlaceBuildingUseCase({
    clock,
    companyRepository,
    buildingRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    regionRepository,
    simulationEngine,
    gameContent: contentResult.value,
  });

  return {
    clock,
    buildingRepository,
    createCompany,
    companyMilestonesRepository,
    companyResearchRepository,
    eventBus,
    financeRepository,
    placeBuilding,
    simulationEngine,
  };
}

function grantFirstProfit(
  clock: ManualClock,
  companyMilestonesRepository: InMemoryCompanyMilestonesRepository,
  companyId: string,
) {
  const companyIdResult = createCompanyId(companyId);

  if (!companyIdResult.ok) {
    throw new Error(companyIdResult.error.message);
  }

  const milestones = companyMilestonesRepository.findByCompanyId(companyIdResult.value);

  if (milestones === undefined) {
    throw new Error(`Milestones for company "${companyId}" were not found.`);
  }

  const milestoneIdResult = createMilestoneId('first_profit');

  if (!milestoneIdResult.ok) {
    throw new Error(milestoneIdResult.error.message);
  }

  milestones.completeMilestone(milestoneIdResult.value, clock);
  companyMilestonesRepository.save(milestones);
}

describe('PlaceBuildingUseCase', () => {
  it('places and persists a building for an existing company', async () => {
    const { buildingRepository, createCompany, placeBuilding } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 2,
      y: 3,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const building = buildingRepository.findById(result.value);
      expect(building?.getName()).toBe('Northern Sawmill');
      expect(building?.getRegionId().value).toBe('region_default');
      expect(building?.getPosition().x).toBe(2);
      expect(building?.getPosition().y).toBe(3);
      expect(building?.getStatus()).toBe(BuildingStatus.UNDER_CONSTRUCTION);
      expect(building?.getConstructionDuration()).toBe(120);
    }
  });

  it('debits construction cost from the company finance account', async () => {
    const { createCompany, financeRepository, placeBuilding } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    expect(result.ok).toBe(true);

    const finance = financeRepository.findByCompanyId(requireCompanyId('company_001'));

    expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 5000);
    expect(finance?.getTransactions().at(-1)?.transactionType).toBe(
      FinanceTransactionType.BUILDING_COST,
    );
  });

  it('completes construction via simulation ticks and activates the building', async () => {
    const { buildingRepository, clock, createCompany, eventBus, placeBuilding, simulationEngine } =
      await createContext();
    const completed: string[] = [];

    eventBus.subscribe('BuildingConstructionCompleted', (event) => {
      completed.push((event as BuildingConstructionCompleted).buildingId);
    });

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const placeResult = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    expect(placeResult.ok).toBe(true);

    completeBuildingConstruction({
      clock,
      simulationEngine,
      buildingRepository,
      buildingId: 'building_001',
    });

    const building = buildingRepository.findById(requireBuildingId('building_001'));

    expect(building?.getStatus()).toBe(BuildingStatus.ACTIVE);
    expect(building?.getConstructionProgress()).toBe(100);
    expect(completed).toEqual(['building_001']);
  });

  it('enqueues BuildingPlaced events for the next simulation tick', async () => {
    const { createCompany, eventBus, placeBuilding, simulationEngine } = await createContext();
    const received: string[] = [];

    eventBus.subscribe('BuildingPlaced', (event) => {
      received.push((event as BuildingPlaced).buildingId);
    });

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const placeResult = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    expect(placeResult.ok).toBe(true);

    const tickResult = simulationEngine.tick();

    expect(tickResult.ok).toBe(true);
    expect(received).toEqual(['building_001']);
  });

  it('rejects placement when the company does not exist', async () => {
    const { placeBuilding } = await createContext();

    const result = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_missing',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects duplicate building ids', async () => {
    const { createCompany, placeBuilding } = await createContext();

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

    const secondResult = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Duplicate Building',
      x: 1,
      y: 1,
    });

    expect(secondResult.ok).toBe(false);
  });

  it('rejects placement when available cash is insufficient for construction cost', async () => {
    const { createCompany, financeRepository, placeBuilding } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const finance = financeRepository.findByCompanyId(requireCompanyId('company_001'));

    if (finance === undefined) {
      throw new Error('Expected finance account to exist.');
    }

    finance.debit(STARTING_MONEY - 1000, FinanceTransactionType.ADMIN, new ManualClock(100));
    financeRepository.save(finance);

    const result = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects unknown building type ids', async () => {
    const { createCompany, placeBuilding } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'unknown_building',
      companyId: 'company_001',
      name: 'Invalid Building',
      x: 0,
      y: 0,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects buildings when required milestones are not completed', async () => {
    const { createCompany, placeBuilding } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const blockedResult = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Main Warehouse',
      x: 0,
      y: 0,
    });

    expect(blockedResult.ok).toBe(false);
  });

  it('allows buildings after required milestones are completed', async () => {
    const { clock, createCompany, placeBuilding, companyMilestonesRepository } =
      await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    grantFirstProfit(clock, companyMilestonesRepository, 'company_001');

    const allowedResult = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Main Warehouse',
      x: 0,
      y: 0,
    });

    expect(allowedResult.ok).toBe(true);
  });

  it('rejects placement in an unknown region', async () => {
    const { createCompany, placeBuilding } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
      regionId: 'region_missing',
    });

    expect(result.ok).toBe(false);
  });
});
