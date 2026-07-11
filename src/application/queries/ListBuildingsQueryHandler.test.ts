import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { ListBuildingsQueryHandler } from './ListBuildingsQueryHandler.js';

function createContext(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    simulationEngine,
  });
  const placeBuilding = new PlaceBuildingUseCase({
    clock,
    companyRepository,
    buildingRepository,
    simulationEngine,
  });
  const listBuildings = new ListBuildingsQueryHandler({
    companyRepository,
    buildingRepository,
  });

  return { createCompany, placeBuilding, listBuildings };
}

describe('ListBuildingsQueryHandler', () => {
  it('returns buildings for an existing company in deterministic order', () => {
    const { createCompany, placeBuilding, listBuildings } = createContext();

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

  it('returns an empty list when the company has no buildings', () => {
    const { createCompany, listBuildings } = createContext();

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

  it('rejects unknown company ids', () => {
    const { listBuildings } = createContext();

    const result = listBuildings.execute({ companyId: 'company_missing' });

    expect(result.ok).toBe(false);
  });
});
