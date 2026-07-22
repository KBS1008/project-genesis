/**
 * @module @domain/brain/events/StrategyChanged
 *
 * Domain event raised when a company changes its active strategy.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload for an active strategy change. */
export class StrategyChanged extends DomainEvent {
  readonly eventName = 'StrategyChanged';
  readonly brainId: string;
  readonly companyId: string;
  readonly strategyDefinitionId: string;

  /**
   * @param occurredAt - Simulation time when the strategy changed.
   * @param brainId - Company brain identifier.
   * @param companyId - Owning company identifier.
   * @param strategyDefinitionId - New active strategy content id.
   */
  constructor(
    occurredAt: number,
    brainId: string,
    companyId: string,
    strategyDefinitionId: string,
  ) {
    super(occurredAt);
    this.brainId = brainId;
    this.companyId = companyId;
    this.strategyDefinitionId = strategyDefinitionId;
    this.freeze();
  }
}
