/**
 * @module @domain/research/events/TechnologyCompleted
 *
 * Domain event raised when a company completes a technology.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a completed technology. */
export class TechnologyCompleted extends DomainEvent {
  readonly eventName = 'TechnologyCompleted';
  readonly companyResearchId: string;
  readonly companyId: string;
  readonly technologyId: string;

  /**
   * @param occurredAt - Simulation time when the technology was completed.
   * @param companyResearchId - Research aggregate identifier.
   * @param companyId - Owning company identifier.
   * @param technologyId - Completed technology identifier.
   */
  constructor(
    occurredAt: number,
    companyResearchId: string,
    companyId: string,
    technologyId: string,
  ) {
    super(occurredAt);
    this.companyResearchId = companyResearchId;
    this.companyId = companyId;
    this.technologyId = technologyId;
    this.freeze();
  }
}
