import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { validateGameContent } from '../../content/validateGameContent.js';
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
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    simulationEngine,
  });
  const placeBuilding = new PlaceBuildingUseCase({
    clock,
    companyRepository,
    buildingRepository,
    financeRepository,
    simulationEngine,
    gameContent: contentResult.value,
  });
  const listBuildings = new ListBuildingsQueryHandler({
    companyRepository,
    buildingRepository,
  });

  return { createCompany, placeBuilding, listBuildings };
}

describe('ListBuildingsQueryHandler', () => {
  it('returns buildings for an existing company in deterministic order', async () => {
    const { createCompany, placeBuilding, listBuildings } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

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
