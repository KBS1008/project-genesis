import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../../common/time/ManualClock.js';
import { validateGameContent } from '../../../content/validateGameContent.js';
import { createBuildingId } from '../../../domain/building/Building.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import {
  Employee,
  createEmployeeId,
  createEmployeeTypeId,
} from '../../../domain/employee/Employee.js';
import { ProductionJob, createProductionJobId } from '../../../domain/production/ProductionJob.js';
import { createRecipeId } from '../../../domain/production/RecipeId.js';
import { EmployeeAllocationService } from '../../../application/services/EmployeeAllocationService.js';
import { InMemoryEmployeeRepository } from '../../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryProductionJobRepository } from '../../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { ProductionSimulationSystem } from './ProductionSimulationSystem.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../../game-content');

function requireProductionJobId(value: string) {
  const result = createProductionJobId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

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

function requireRecipeId(value: string) {
  const result = createRecipeId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireEmployeeId(value: string) {
  const result = createEmployeeId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireEmployeeTypeId(value: string) {
  const result = createEmployeeTypeId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('ProductionSimulationSystem', () => {
  it('stalls production when required workers are missing', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    if (!contentResult.ok) {
      throw new Error(contentResult.error.message);
    }

    const clock = new ManualClock(100);
    const productionJobRepository = new InMemoryProductionJobRepository();
    const employeeRepository = new InMemoryEmployeeRepository();
    const employeeAllocationService = new EmployeeAllocationService({
      employeeRepository,
      gameContent: contentResult.value,
    });

    const jobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    jobResult.value.start(clock);
    jobResult.value.pullDomainEvents();
    productionJobRepository.save(jobResult.value);
    clock.advance(10);

    const system = new ProductionSimulationSystem({
      productionJobRepository,
      employeeAllocationService,
      enqueueEvents: () => undefined,
    });

    system.execute({ tickNumber: 1, clock });

    expect(productionJobRepository.findById(requireProductionJobId('job_001'))?.getProgress()).toBe(
      0,
    );
  });

  it('advances production when assigned workers satisfy recipe requirements', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    if (!contentResult.ok) {
      throw new Error(contentResult.error.message);
    }

    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const buildingId = requireBuildingId('building_001');
    const productionJobRepository = new InMemoryProductionJobRepository();
    const employeeRepository = new InMemoryEmployeeRepository();
    const employeeAllocationService = new EmployeeAllocationService({
      employeeRepository,
      gameContent: contentResult.value,
    });

    for (let index = 1; index <= 2; index += 1) {
      const hireResult = Employee.hire({
        id: requireEmployeeId(`employee_00${index}`),
        companyId,
        employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
        displayName: `Worker ${index}`,
        salary: 120,
        productivity: 1,
        clock,
      });

      expect(hireResult.ok).toBe(true);

      if (!hireResult.ok) {
        return;
      }

      hireResult.value.assignToBuilding(buildingId, clock);
      hireResult.value.pullDomainEvents();
      employeeRepository.save(hireResult.value);
    }

    const jobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId,
      companyId,
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    jobResult.value.start(clock);
    jobResult.value.pullDomainEvents();
    productionJobRepository.save(jobResult.value);
    clock.advance(10);

    const system = new ProductionSimulationSystem({
      productionJobRepository,
      employeeAllocationService,
      enqueueEvents: () => undefined,
    });

    system.execute({ tickNumber: 1, clock });

    expect(productionJobRepository.findById(requireProductionJobId('job_001'))?.getProgress()).toBe(
      100,
    );
  });
});
