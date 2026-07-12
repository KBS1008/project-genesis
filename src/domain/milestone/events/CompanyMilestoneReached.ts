/**
 * @module @domain/milestone/events/CompanyMilestoneReached
 *
 * Domain event raised when a company reaches a milestone.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a reached company milestone. */
export class CompanyMilestoneReached extends DomainEvent {
  readonly eventName = 'CompanyMilestoneReached';
  readonly companyMilestonesId: string;
  readonly companyId: string;
  readonly milestoneId: string;

  /**
   * @param occurredAt - Simulation time when the milestone was reached.
   * @param companyMilestonesId - Milestones aggregate identifier.
   * @param companyId - Owning company identifier.
   * @param milestoneId - Reached milestone identifier.
   */
  constructor(
    occurredAt: number,
    companyMilestonesId: string,
    companyId: string,
    milestoneId: string,
  ) {
    super(occurredAt);
    this.companyMilestonesId = companyMilestonesId;
    this.companyId = companyId;
    this.milestoneId = milestoneId;
    this.freeze();
  }
}
