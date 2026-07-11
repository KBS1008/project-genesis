import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { BuildingPlaced } from '../../domain/building/events/BuildingPlaced.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';

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

  return {
    buildingRepository,
    createCompany,
    eventBus,
    placeBuilding,
    simulationEngine,
  };
}

describe('PlaceBuildingUseCase', () => {
  it('places and persists a building for an existing company', () => {
    const { buildingRepository, createCompany, placeBuilding } = createContext();

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

  it('enqueues BuildingPlaced events for the next simulation tick', () => {
    const { createCompany, eventBus, placeBuilding, simulationEngine } = createContext();
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

  it('rejects placement when the company does not exist', () => {
    const { placeBuilding } = createContext();

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

  it('rejects duplicate building ids', () => {
    const { createCompany, placeBuilding } = createContext();

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
});
