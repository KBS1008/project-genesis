/**
 * @module @domain/brain/events/GoalCreated
 *
 * Domain event raised when a company goal is created.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a newly created company goal. */
export class GoalCreated extends DomainEvent {
  readonly eventName = 'GoalCreated';
  readonly brainId: string;
  readonly companyId: string;
  readonly goalId: string;
  readonly goalKind: string;

  /**
   * @param occurredAt - Simulation time when the goal was created.
   * @param brainId - Company brain identifier.
   * @param companyId - Owning company identifier.
   * @param goalId - Created goal identifier.
   * @param goalKind - Kind of goal created.
   */
  constructor(
    occurredAt: number,
    brainId: string,
    companyId: string,
    goalId: string,
    goalKind: string,
  ) {
    super(occurredAt);
    this.brainId = brainId;
    this.companyId = companyId;
    this.goalId = goalId;
    this.goalKind = goalKind;
    this.freeze();
  }
}
