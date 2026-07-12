/**
 * @module @domain/research/events/ResearchCompleted
 *
 * Domain event raised when a research job finishes successfully.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a completed research job. */
export class ResearchCompleted extends DomainEvent {
  readonly eventName = 'ResearchCompleted';
  readonly jobId: string;
  readonly companyId: string;
  readonly technologyId: string;

  /**
   * @param occurredAt - Simulation time when the research job completed.
   * @param jobId - Research job identifier.
   * @param companyId - Owning company identifier.
   * @param technologyId - Technology that finished researching.
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
