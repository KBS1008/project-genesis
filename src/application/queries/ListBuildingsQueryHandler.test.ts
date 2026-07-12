import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { ListBuildingsQueryHandler } from './ListBuildingsQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

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
  const listBuildings = new ListBuildingsQueryHandler({
    companyRepository,
    buildingRepository,
  });

  return { clock, createCompany, placeBuilding, listBuildings, companyMilestonesRepository };
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

describe('ListBuildingsQueryHandler', () => {
  it('returns buildings for an existing company in deterministic order', async () => {
    const { clock, createCompany, placeBuilding, listBuildings, companyMilestonesRepository } =
      await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    grantFirstProfit(clock, companyMilestonesRepository, 'company_001');

    placeBuilding.execute({
      buildingId: 'building_002',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Main Warehouse',
      x: 5,
      y: 1,
    });

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Northern Sawmill',
      x: 0,
      y: 0,
    });

    const result = listBuildings.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0]?.id).toBe('building_001');
      expect(result.value[1]?.id).toBe('building_002');
      expect(result.value[0]?.buildingTypeId).toBe('sawmill');
      expect(result.value[1]?.x).toBe(5);
    }
  });

  it('returns an empty list when the company has no buildings', async () => {
    const { createCompany, listBuildings } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = listBuildings.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual([]);
    }
  });

  it('rejects unknown company ids', async () => {
    const { listBuildings } = await createContext();

    const result = listBuildings.execute({ companyId: 'company_missing' });

    expect(result.ok).toBe(false);
  });
});
