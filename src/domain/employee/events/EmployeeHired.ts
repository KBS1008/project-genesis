/**
 * @module @domain/employee/events/EmployeeHired
 *
 * Domain event raised when a company hires an employee.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that an employee has been hired.
 */
export class EmployeeHired extends DomainEvent {
  readonly eventName = 'EmployeeHired';
  readonly employeeId: string;
  readonly companyId: string;
  readonly employeeTypeId: string;
  readonly salary: number;
  readonly productivity: number;

  constructor(
    occurredAt: number,
    employeeId: string,
    companyId: string,
    employeeTypeId: string,
    salary: number,
    productivity: number,
  ) {
    super(occurredAt);
    this.employeeId = employeeId;
    this.companyId = companyId;
    this.employeeTypeId = employeeTypeId;
    this.salary = salary;
    this.productivity = productivity;
    this.freeze();
  }
}
