/**
 * @module @domain/employee/events/EmployeeAssignedToBuilding
 *
 * Domain event raised when an employee is assigned to a building.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that an employee has been assigned to a building.
 */
export class EmployeeAssignedToBuilding extends DomainEvent {
  readonly eventName = 'EmployeeAssignedToBuilding';
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
