/**
 * @module @domain/brain/events/GoalCompleted
 *
 * Domain event raised when a company goal is completed.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for a completed company goal. */
export class GoalCompleted extends DomainEvent {
  readonly eventName = 'GoalCompleted';
  readonly brainId: string;
  readonly companyId: string;
  readonly goalId: string;

  /**
   * @param occurredAt - Simulation time when the goal was completed.
   * @param brainId - Company brain identifier.
   * @param companyId - Owning company identifier.
   * @param goalId - Completed goal identifier.
   */
  constructor(occurredAt: number, brainId: string, companyId: string, goalId: string) {
    super(occurredAt);
    this.brainId = brainId;
    this.companyId = companyId;
    this.goalId = goalId;
    this.freeze();
  }
}
