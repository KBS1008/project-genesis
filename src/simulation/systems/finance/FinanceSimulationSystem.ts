/**
 * @module @simulation/systems/finance/FinanceSimulationSystem
 *
 * Processes company finance tick work each tick.
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { EmployeeRepository } from '../../../domain/employee/EmployeeRepository.js';
import { PAYROLL_INTERVAL_TICKS } from '../../../domain/employee/EmployeePayrollConstants.js';
import { FinanceTransactionType } from '../../../domain/finance/FinanceTransactionType.js';
import type { FinanceRepository } from '../../../domain/finance/FinanceRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link FinanceSimulationSystem}. */
export type FinanceSimulationSystemDependencies = {
  readonly financeRepository: FinanceRepository;
  readonly employeeRepository: EmployeeRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Visits all persisted finance accounts during each simulation tick.
 */
export class FinanceSimulationSystem implements SimulationSystem {
  readonly name = 'Finance';
  readonly #financeRepository: FinanceRepository;
  readonly #employeeRepository: EmployeeRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  /**
   * @param dependencies - Repositories and event enqueue callback.
   */
  constructor(dependencies: FinanceSimulationSystemDependencies) {
    this.#financeRepository = dependencies.financeRepository;
    this.#employeeRepository = dependencies.employeeRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  execute(context: TickContext): void {
    if (context.tickNumber % PAYROLL_INTERVAL_TICKS !== 0) {
      return;
    }

    for (const finance of this.#financeRepository.findAll()) {
      const employees = this.#employeeRepository.findByCompanyId(finance.getCompanyId());
      const payrollAmount = employees.reduce((total, employee) => total + employee.getSalary(), 0);

      if (payrollAmount === 0) {
        continue;
      }

      const debitResult = finance.debit(
        payrollAmount,
        FinanceTransactionType.SALARY,
        context.clock,
      );

      if (!debitResult.ok) {
        continue;
      }

      this.#financeRepository.save(finance);
      this.#enqueueEvents(finance.pullDomainEvents());
    }
  }
}
