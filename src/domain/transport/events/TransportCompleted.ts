/**
 * @module @domain/transport/events/TransportCompleted
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Raised when a transport order finishes delivery. */
export class TransportCompleted extends DomainEvent {
  readonly eventName = 'TransportCompleted';
  readonly transportOrderId: string;
  readonly companyId: string;
  readonly sourceBuildingId: string;
  readonly destinationBuildingId: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly productionJobId: string;
  readonly sourceRegionId: string;
  readonly destinationRegionId: string;

  constructor(
    occurredAt: number,
    transportOrderId: string,
    companyId: string,
    sourceBuildingId: string,
    destinationBuildingId: string,
    resourceId: string,
    amount: number,
    productionJobId: string,
    sourceRegionId: string,
    destinationRegionId: string,
  ) {
    super(occurredAt);
    this.transportOrderId = transportOrderId;
    this.companyId = companyId;
    this.sourceBuildingId = sourceBuildingId;
    this.destinationBuildingId = destinationBuildingId;
    this.resourceId = resourceId;
    this.amount = amount;
    this.productionJobId = productionJobId;
    this.sourceRegionId = sourceRegionId;
    this.destinationRegionId = destinationRegionId;
    this.freeze();
  }
}
