/**
 * @module @domain/research/events/ResearchStarted
 *
 * Domain event raised when a research job starts running.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a started research job. */
export class ResearchStarted extends DomainEvent {
  readonly eventName = 'ResearchStarted';
  readonly jobId: string;
  readonly companyId: string;
  readonly technologyId: string;

  /**
   * @param occurredAt - Simulation time when the research job started.
   * @param jobId - Research job identifier.
   * @param companyId - Owning company identifier.
   * @param technologyId - Technology being researched.
   */
  constructor(
    occurredAt: number,
    jobId: string,
    companyId: string,
    technologyId: string,
  ) {
    super(occurredAt);
    this.jobId = jobId;
    this.companyId = companyId;
    this.technologyId = technologyId;
    this.freeze();
  }
}
