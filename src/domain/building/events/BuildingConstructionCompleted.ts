/**
 * @module @domain/building/events/BuildingConstructionCompleted
 *
 * Domain event raised when building construction finishes.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload when a building becomes active after construction. */
export class BuildingConstructionCompleted extends DomainEvent {
  readonly eventName = 'BuildingConstructionCompleted';
  readonly buildingId: string;
  readonly companyId: string;
  readonly buildingTypeId: string;

  /**
   * @param occurredAt - Simulation time when construction completed.
   * @param buildingId - Building identifier.
   * @param companyId - Owning company identifier.
   * @param buildingTypeId - Building type identifier.
   */
  constructor(
    occurredAt: number,
    buildingId: string,
    companyId: string,
    buildingTypeId: string,
  ) {
    super(occurredAt);
    this.buildingId = buildingId;
    this.companyId = companyId;
    this.buildingTypeId = buildingTypeId;
    this.freeze();
  }
}
