import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { BuildingPlaced } from '../../domain/building/events/BuildingPlaced.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

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

  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });

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
      expect(building?.getPosition().x).toBe(2);
      expect(building?.getPosition().y).toBe(3);
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
});
