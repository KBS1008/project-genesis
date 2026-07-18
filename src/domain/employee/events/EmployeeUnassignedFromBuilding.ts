/**
 * @module @domain/employee/events/EmployeeUnassignedFromBuilding
 *
 * Domain event raised when an employee is removed from a building assignment.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that an employee has been unassigned from a building.
 */
export class EmployeeUnassignedFromBuilding extends DomainEvent {
  readonly eventName = 'EmployeeUnassignedFromBuilding';
  readonly employeeId: string;
  readonly companyId: string;
  readonly buildingId: string;

  constructor(
    occurredAt: number,
    employeeId: string,
    companyId: string,
    buildingId: string,
  ) {
    super(occurredAt);
    this.employeeId = employeeId;
    this.companyId = companyId;
    this.buildingId = buildingId;
    this.freeze();
  }
}
