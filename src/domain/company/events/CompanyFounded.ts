/**
 * @module @domain/company/events/CompanyFounded
 *
 * Domain event raised when a new company is created.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that a company has been founded.
 */
export class CompanyFounded extends DomainEvent {
  readonly eventName = 'CompanyFounded';
  readonly companyId: string;
  readonly ownerId: string;
  readonly name: string;

  /**
   * @param occurredAt - Simulation time when the company was founded.
   * @param companyId - The founded company's identifier value.
   * @param ownerId - The owning player's identifier value.
   * @param name - The company display name.
   */
  constructor(occurredAt: number, companyId: string, ownerId: string, name: string) {
    super(occurredAt);
    this.companyId = companyId;
    this.ownerId = ownerId;
    this.name = name;
    this.freeze();
  }
}
