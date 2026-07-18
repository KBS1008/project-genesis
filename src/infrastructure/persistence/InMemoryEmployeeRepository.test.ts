import { ManualClock } from '../../common/time/ManualClock.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import {
  Employee,
  createEmployeeId,
  createEmployeeTypeId,
} from '../../domain/employee/Employee.js';
import { InMemoryEmployeeRepository } from './InMemoryEmployeeRepository.js';

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

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

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

describe('InMemoryEmployeeRepository', () => {
  it('saves and retrieves employees by id', () => {
    const repository = new InMemoryEmployeeRepository();
    const clock = new ManualClock(100);
    const employeeResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Production Worker',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(employeeResult.ok).toBe(true);

    if (!employeeResult.ok) {
      return;
    }

    repository.save(employeeResult.value);

    expect(repository.findById(requireEmployeeId('employee_001'))).toBe(employeeResult.value);
  });

  it('returns employees for a company in deterministic id order', () => {
    const repository = new InMemoryEmployeeRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');

    const second = Employee.hire({
      id: requireEmployeeId('employee_002'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_engineer_basic'),
      displayName: 'Engineer B',
      salary: 180,
      productivity: 1.2,
      clock,
    });
    const first = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Worker A',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    if (!second.ok || !first.ok) {
      throw new Error('Expected valid employees.');
    }

    repository.save(second.value);
    repository.save(first.value);

    expect(repository.findByCompanyId(companyId).map((employee) => employee.getId().value)).toEqual(
      ['employee_001', 'employee_002'],
    );
  });

  it('returns employees assigned to a building in deterministic id order', () => {
    const repository = new InMemoryEmployeeRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const buildingId = requireBuildingId('building_001');

    const second = Employee.hire({
      id: requireEmployeeId('employee_002'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_engineer_basic'),
      displayName: 'Engineer B',
      salary: 180,
      productivity: 1.2,
      clock,
    });
    const first = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Worker A',
      salary: 120,
      productivity: 1.0,
      clock,
    });
    const unassigned = Employee.hire({
      id: requireEmployeeId('employee_003'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_researcher_basic'),
      displayName: 'Researcher C',
      salary: 220,
      productivity: 1.1,
      clock,
    });

    if (!second.ok || !first.ok || !unassigned.ok) {
      throw new Error('Expected valid employees.');
    }

    first.value.assignToBuilding(buildingId, clock);
    second.value.assignToBuilding(buildingId, clock);

    repository.save(unassigned.value);
    repository.save(second.value);
    repository.save(first.value);

    expect(
      repository.findByBuildingId(buildingId).map((employee) => employee.getId().value),
    ).toEqual(['employee_001', 'employee_002']);
  });
});
