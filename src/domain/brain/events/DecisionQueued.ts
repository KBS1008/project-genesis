/**
 * @module @domain/brain/events/DecisionQueued
 *
 * Domain event raised when a validated decision is queued for execution.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a queued company decision. */
export class DecisionQueued extends DomainEvent {
  readonly eventName = 'DecisionQueued';
  readonly brainId: string;
  readonly companyId: string;
  readonly decisionId: string;
  readonly decisionType: string;

  /**
   * @param occurredAt - Simulation time when the decision was queued.
   * @param brainId - Company brain identifier.
   * @param companyId - Owning company identifier.
   * @param decisionId - Queued decision identifier.
   * @param decisionType - Type of queued decision.
   */
  constructor(
    occurredAt: number,
    brainId: string,
    companyId: string,
    decisionId: string,
    decisionType: string,
  ) {
    super(occurredAt);
    this.brainId = brainId;
    this.companyId = companyId;
    this.decisionId = decisionId;
    this.decisionType = decisionType;
    this.freeze();
  }
}
