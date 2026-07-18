import { ManualClock } from '../../../common/time/ManualClock.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import { Employee, createEmployeeId, createEmployeeTypeId } from '../../../domain/employee/Employee.js';
import { PAYROLL_INTERVAL_TICKS } from '../../../domain/employee/EmployeePayrollConstants.js';
import { FinanceTransactionType } from '../../../domain/finance/FinanceTransactionType.js';
import { STARTING_MONEY } from '../../../domain/finance/FinanceConstants.js';
import { createFinanceAccountId } from '../../../domain/finance/FinanceAccount.js';
import { FinanceAccount } from '../../../domain/finance/FinanceAccount.js';
import { InMemoryEmployeeRepository } from '../../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryFinanceRepository } from '../../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { FinanceSimulationSystem } from './FinanceSimulationSystem.js';

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

function requireFinanceAccountId(value: string) {
  const result = createFinanceAccountId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('FinanceSimulationSystem', () => {
  it('debits combined employee salaries on payroll ticks', () => {
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const financeRepository = new InMemoryFinanceRepository();
    const employeeRepository = new InMemoryEmployeeRepository();
    const events: string[] = [];

    const financeResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId,
      clock,
    });

    expect(financeResult.ok).toBe(true);

    if (!financeResult.ok) {
      return;
    }

    financeRepository.save(financeResult.value);

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

    if (hireResult.ok) {
      hireResult.value.pullDomainEvents();
      employeeRepository.save(hireResult.value);
    }

    const system = new FinanceSimulationSystem({
      financeRepository,
      employeeRepository,
      enqueueEvents: (domainEvents) => {
        events.push(...domainEvents.map((event) => event.eventName));
      },
    });

    system.execute({ tickNumber: PAYROLL_INTERVAL_TICKS, clock });

    const finance = financeRepository.findByCompanyId(companyId);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 120);
    expect(finance?.getTransactions().at(-1)?.transactionType).toBe(FinanceTransactionType.SALARY);
    expect(events).toContain('FinanceTransactionRecorded');
  });

  it('skips payroll on non-payroll ticks', () => {
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const financeRepository = new InMemoryFinanceRepository();
    const employeeRepository = new InMemoryEmployeeRepository();

    const financeResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId,
      clock,
    });

    expect(financeResult.ok).toBe(true);

    if (!financeResult.ok) {
      return;
    }

    financeRepository.save(financeResult.value);

    const hireResult = Employee.hire({
      id: requireEmployeeId('employee_001'),
      companyId,
      employeeTypeId: requireEmployeeTypeId('employee_production_worker'),
      displayName: 'Worker',
      salary: 120,
      productivity: 1,
      clock,
    });

    if (hireResult.ok) {
      hireResult.value.pullDomainEvents();
      employeeRepository.save(hireResult.value);
    }

    const system = new FinanceSimulationSystem({
      financeRepository,
      employeeRepository,
      enqueueEvents: () => undefined,
    });

    system.execute({ tickNumber: 1, clock });

    const finance = financeRepository.findByCompanyId(companyId);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY);
  });
});
