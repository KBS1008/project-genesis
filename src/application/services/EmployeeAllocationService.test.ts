import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import {
  Employee,
  createEmployeeId,
  createEmployeeTypeId,
} from '../../domain/employee/Employee.js';
import { EmployeeAllocationService } from './EmployeeAllocationService.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';

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

describe('EmployeeAllocationService', () => {
  it('returns proportional worker efficiency from assigned employees and recipe requirements', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    if (!contentResult.ok) {
      throw new Error(contentResult.error.message);
    }

    const employeeRepository = new InMemoryEmployeeRepository();
    const service = new EmployeeAllocationService({
      employeeRepository,
      gameContent: contentResult.value,
    });
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const buildingId = requireBuildingId('building_001');

    const hireResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Worker',
      salary: 120,
      productivity: 1,
      clock,
    });

    expect(hireResult.ok).toBe(true);

    if (!hireResult.ok) {
      return;
    }

    hireResult.value.assignToBuilding(buildingId, clock);
    employeeRepository.save(hireResult.value);

    expect(service.getAssignedWorkerCount(buildingId)).toBe(1);
    expect(service.getWorkerEfficiency(buildingId, 'recipe_planks')).toBe(0.5);
  });
});
