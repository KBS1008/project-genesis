/**
 * @module @domain/transport/events/TransportCompleted
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Raised when a transport order finishes delivery. */
export class TransportCompleted extends DomainEvent {
  readonly transportOrderId: string;
  readonly companyId: string;
  readonly sourceBuildingId: string;
  readonly destinationBuildingId: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly productionJobId: string;

  constructor(
    occurredAt: number,
    transportOrderId: string,
    companyId: string,
    sourceBuildingId: string,
    destinationBuildingId: string,
    resourceId: string,
    amount: number,
    productionJobId: string,
  ) {
    super('TransportCompleted', occurredAt);
    this.transportOrderId = transportOrderId;
    this.companyId = companyId;
    this.sourceBuildingId = sourceBuildingId;
    this.destinationBuildingId = destinationBuildingId;
    this.resourceId = resourceId;
    this.amount = amount;
    this.productionJobId = productionJobId;
  }
}
