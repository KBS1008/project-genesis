import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { EmployeeHired } from '../../domain/employee/events/EmployeeHired.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { HireEmployeeUseCase } from './HireEmployeeUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function createContext(clock = new ManualClock(100)) {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const employeeRepository = new InMemoryEmployeeRepository();
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

  return {
    clock,
    createCompany,
    employeeRepository,
    financeRepository,
    eventBus,
    hireEmployee,
    simulationEngine,
  };
}

describe('HireEmployeeUseCase', () => {
  it('hires and persists a production worker', async () => {
    const { createCompany, employeeRepository, hireEmployee } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const employee = employeeRepository.findById(result.value);
      expect(employee?.getDisplayName()).toBe('Production Worker');
      expect(employee?.getSalary()).toBe(120);
      expect(employee?.getProductivity()).toBe(1.0);
    }
  });

  it('debits the recruitment cost from the company finance account', async () => {
    const { createCompany, financeRepository, hireEmployee } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(result.ok).toBe(true);

    const companyIdResult = createCompanyId('company_001');

    if (!companyIdResult.ok) {
      throw new Error(companyIdResult.error.message);
    }

    const finance = financeRepository.findByCompanyId(companyIdResult.value);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 800);
    expect(finance?.getTransactions().at(-1)?.transactionType).toBe(
      FinanceTransactionType.RECRUITMENT_COST,
    );
  });

  it('enqueues EmployeeHired events for the next simulation tick', async () => {
    const { createCompany, eventBus, hireEmployee, simulationEngine } = await createContext();
    const received: string[] = [];

    eventBus.subscribe('EmployeeHired', (event) => {
      received.push((event as EmployeeHired).employeeId);
    });

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const hireResult = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(hireResult.ok).toBe(true);
    simulationEngine.tick();

    expect(received).toEqual(['employee_001']);
  });

  it('rejects hiring when required buildings are missing', async () => {
    const { createCompany, hireEmployee } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_administrator_basic',
      displayName: 'Administrator',
    });

    expect(result.ok).toBe(false);
  });

  it('rejects hiring when cash is insufficient', async () => {
    const { clock, createCompany, financeRepository, hireEmployee } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const companyIdResult = createCompanyId('company_001');

    if (!companyIdResult.ok) {
      throw new Error(companyIdResult.error.message);
    }

    const finance = financeRepository.findByCompanyId(companyIdResult.value);

    if (finance === undefined) {
      throw new Error('Finance account was not found.');
    }

    finance.debit(STARTING_MONEY, FinanceTransactionType.ADMIN, clock);
    financeRepository.save(finance);

    const result = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(result.ok).toBe(false);
  });

  it('rejects duplicate employee ids', async () => {
    const { createCompany, hireEmployee } = await createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    const result = hireEmployee.execute({
      employeeId: 'employee_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Duplicate Worker',
    });

    expect(result.ok).toBe(false);
  });
});
