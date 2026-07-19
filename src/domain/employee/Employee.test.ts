import { ManualClock } from '../../common/time/ManualClock.js';
import { createBuildingId } from '../building/Building.js';
import { createCompanyId } from '../company/Company.js';
import { Employee, createEmployeeId, createEmployeeTypeId } from './Employee.js';
import { EmployeeStatus } from './EmployeeStatus.js';
import type { EmployeeAssignedToBuilding } from './events/EmployeeAssignedToBuilding.js';
import type { EmployeeHired } from './events/EmployeeHired.js';
import type { EmployeeUnassignedFromBuilding } from './events/EmployeeUnassignedFromBuilding.js';

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

describe('Employee', () => {
  it('hires an active employee and raises EmployeeHired', () => {
    const clock = new ManualClock(100);
    const result = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Production Worker',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getStatus()).toBe(EmployeeStatus.ACTIVE);
      expect(result.value.getHiredAt()).toBe(100);
      expect(result.value.getSalary()).toBe(120);
      expect(result.value.getProductivity()).toBe(1.0);
      expect(result.value.isAssigned()).toBe(false);
    }

    if (result.ok) {
      const events = result.value.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect((events[0] as EmployeeHired).employeeTypeId).toBe('employee_production_worker');
    }
  });

  it('rejects invalid hire parameters', () => {
    const clock = new ManualClock(100);
    const emptyNameResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: '   ',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(emptyNameResult.ok).toBe(false);

    const zeroSalaryResult = Employee.hire({
      id: requireEmployeeId('employee_002'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Worker',
      salary: 0,
      productivity: 1.0,
      clock,
    });

    expect(zeroSalaryResult.ok).toBe(false);

    const zeroProductivityResult = Employee.hire({
      id: requireEmployeeId('employee_003'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Worker',
      salary: 120,
      productivity: 0,
      clock,
    });

    expect(zeroProductivityResult.ok).toBe(false);
  });

  it('assigns an employee to a building and raises EmployeeAssignedToBuilding', () => {
    const clock = new ManualClock(100);
    const hireResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Production Worker',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(hireResult.ok).toBe(true);

    if (!hireResult.ok) {
      return;
    }

    hireResult.value.pullDomainEvents();

    const assignResult = hireResult.value.assignToBuilding(
      requireBuildingId('building_001'),
      clock,
    );

    expect(assignResult.ok).toBe(true);
    expect(hireResult.value.isAssigned()).toBe(true);
    expect(hireResult.value.getAssignedBuildingId()?.value).toBe('building_001');

    const events = hireResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as EmployeeAssignedToBuilding).buildingId).toBe('building_001');
  });

  it('rejects assignment when already assigned', () => {
    const clock = new ManualClock(100);
    const hireResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Production Worker',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(hireResult.ok).toBe(true);

    if (!hireResult.ok) {
      return;
    }

    hireResult.value.assignToBuilding(requireBuildingId('building_001'), clock);
    hireResult.value.pullDomainEvents();

    const secondAssignResult = hireResult.value.assignToBuilding(
      requireBuildingId('building_002'),
      clock,
    );

    expect(secondAssignResult.ok).toBe(false);
  });

  it('unassigns an employee from a building and raises EmployeeUnassignedFromBuilding', () => {
    const clock = new ManualClock(100);
    const hireResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Production Worker',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(hireResult.ok).toBe(true);

    if (!hireResult.ok) {
      return;
    }

    hireResult.value.assignToBuilding(requireBuildingId('building_001'), clock);
    hireResult.value.pullDomainEvents();

    const unassignResult = hireResult.value.unassignFromBuilding(clock);

    expect(unassignResult.ok).toBe(true);
    expect(hireResult.value.isAssigned()).toBe(false);

    const events = hireResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as EmployeeUnassignedFromBuilding).buildingId).toBe('building_001');
  });

  it('rejects unassign when not assigned', () => {
    const clock = new ManualClock(100);
    const hireResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Production Worker',
      salary: 120,
      productivity: 1.0,
      clock,
    });

    expect(hireResult.ok).toBe(true);

    if (!hireResult.ok) {
      return;
    }

    const unassignResult = hireResult.value.unassignFromBuilding(clock);

    expect(unassignResult.ok).toBe(false);
  });

  it('restores an employee without raising domain events', () => {
    const restoreResult = Employee.restore({
      id: requireEmployeeId('employee_001'),
      companyId: requireCompanyId('company_001'),
      employeeTypeId: requireEmployeeTypeId('employee_engineer_basic'),
      displayName: 'Engineer',
      salary: 180,
      productivity: 1.2,
      hiredAt: 50,
      status: EmployeeStatus.ACTIVE,
      assignedBuildingId: requireBuildingId('building_001'),
    });

    expect(restoreResult.ok).toBe(true);

    if (restoreResult.ok) {
      expect(restoreResult.value.getHiredAt()).toBe(50);
      expect(restoreResult.value.getAssignedBuildingId()?.value).toBe('building_001');
      expect(restoreResult.value.pullDomainEvents()).toEqual([]);
    }
  });
});
