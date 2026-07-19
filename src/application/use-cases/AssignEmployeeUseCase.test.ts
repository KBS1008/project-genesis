import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import type { EmployeeAssignedToBuilding } from '../../domain/employee/events/EmployeeAssignedToBuilding.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemorySupplyContractRepository } from '../../infrastructure/persistence/InMemorySupplyContractRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { createTransportTestServices } from '../../../tests/helpers/createTransportTestServices.js';
import { bootstrapWorldFromContent } from '../../../tests/helpers/bootstrapWorldFromContent.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { completeBuildingConstruction } from '../../../tests/helpers/completeBuildingConstruction.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { HireEmployeeUseCase } from './HireEmployeeUseCase.js';
import { AssignEmployeeUseCase } from './AssignEmployeeUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function createContext(clock = new ManualClock(100)) {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const { regionRepository } = bootstrapWorldFromContent(contentResult.value);

  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const employeeRepository = new InMemoryEmployeeRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
  const marketRepository = new InMemoryMarketRepository();
  const supplyContractRepository = new InMemorySupplyContractRepository();

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
  const hireEmployee = new HireEmployeeUseCase({
    clock,
    companyRepository,
    employeeRepository,
    buildingRepository,
    financeRepository,
    companyResearchRepository,
    simulationEngine,
    gameContent: contentResult.value,
  });
  const assignEmployee = new AssignEmployeeUseCase({
    clock,
    employeeRepository,
    buildingRepository,
    simulationEngine,
  });

  return {
    clock,
    assignEmployee,
    buildingRepository,
    createCompany,
    employeeRepository,
    eventBus,
    hireEmployee,
    placeBuilding,
    simulationEngine,
  };
}

describe('AssignEmployeeUseCase', () => {
  it('assigns an employee to an active building', async () => {
    const {
      assignEmployee,
      clock,
      createCompany,
      employeeRepository,
      hireEmployee,
      placeBuilding,
      simulationEngine,
      buildingRepository,
    } = await createContext();

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

    completeBuildingConstruction({
      buildingId: 'building_001',
      clock,
      simulationEngine,
      buildingRepository,
    });

    const hireResult = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(hireResult.ok).toBe(true);

    if (!hireResult.ok) {
      return;
    }

    const assignResult = assignEmployee.execute({
      employeeId: 'employee_001',
      buildingId: 'building_001',
    });

    expect(assignResult.ok).toBe(true);

    const employee = employeeRepository.findById(hireResult.value);
    expect(employee?.getAssignedBuildingId()?.value).toBe('building_001');
  });

  it('rejects assignment when the building is not active', async () => {
    const { assignEmployee, createCompany, hireEmployee, placeBuilding } = await createContext();

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

    hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    const assignResult = assignEmployee.execute({
      employeeId: 'employee_001',
      buildingId: 'building_001',
    });

    expect(assignResult.ok).toBe(false);
  });

  it('rejects assignment when the employee is already assigned', async () => {
    const {
      assignEmployee,
      clock,
      createCompany,
      hireEmployee,
      placeBuilding,
      simulationEngine,
      buildingRepository,
    } = await createContext();

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
    placeBuilding.execute({
      buildingId: 'building_002',
      buildingTypeId: 'sawmill',
      companyId: 'company_001',
      name: 'Southern Sawmill',
      x: 1,
      y: 1,
    });

    completeBuildingConstruction({
      buildingId: 'building_001',
      clock,
      simulationEngine,
      buildingRepository,
    });
    completeBuildingConstruction({
      buildingId: 'building_002',
      clock,
      simulationEngine,
      buildingRepository,
    });

    hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    assignEmployee.execute({
      employeeId: 'employee_001',
      buildingId: 'building_001',
    });

    const secondAssignResult = assignEmployee.execute({
      employeeId: 'employee_001',
      buildingId: 'building_002',
    });

    expect(secondAssignResult.ok).toBe(false);
  });

  it('enqueues EmployeeAssignedToBuilding events for the next simulation tick', async () => {
    const {
      assignEmployee,
      clock,
      createCompany,
      eventBus,
      hireEmployee,
      placeBuilding,
      simulationEngine,
      buildingRepository,
    } = await createContext();
    const received: string[] = [];

    eventBus.subscribe('EmployeeAssignedToBuilding', (event) => {
      received.push((event as EmployeeAssignedToBuilding).buildingId);
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
    completeBuildingConstruction({
      buildingId: 'building_001',
      clock,
      simulationEngine,
      buildingRepository,
    });

    hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    const assignResult = assignEmployee.execute({
      employeeId: 'employee_001',
      buildingId: 'building_001',
    });

    expect(assignResult.ok).toBe(true);
    simulationEngine.tick();

    expect(received).toEqual(['building_001']);
  });
});
