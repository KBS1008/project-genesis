/**
 * @module @domain/production/events/ProductionStarted
 *
 * Domain event raised when a production job starts running.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that a production job has started.
 */
export class ProductionStarted extends DomainEvent {
  readonly eventName = 'ProductionStarted';
  readonly jobId: string;
  readonly buildingId: string;
  readonly companyId: string;
  readonly recipeId: string;

  constructor(
    occurredAt: number,
    jobId: string,
    buildingId: string,
    companyId: string,
    recipeId: string,
  ) {
    super(occurredAt);
    this.jobId = jobId;
    this.buildingId = buildingId;
    this.companyId = companyId;
    this.recipeId = recipeId;
    this.freeze();
  }
}
