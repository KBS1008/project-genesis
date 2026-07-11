/**
 * @module @domain/production/events/ProductionCompleted
 *
 * Domain event raised when a production job finishes successfully.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that a production job has completed.
 */
export class ProductionCompleted extends DomainEvent {
  readonly eventName = 'ProductionCompleted';
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
