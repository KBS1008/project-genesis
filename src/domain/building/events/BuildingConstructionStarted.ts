/**
 * @module @domain/building/events/BuildingConstructionStarted
 *
 * Domain event raised when building construction begins.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/** Event payload when construction starts on a building. */
export class BuildingConstructionStarted extends DomainEvent {
  readonly eventName = 'BuildingConstructionStarted';
  readonly buildingId: string;
  readonly companyId: string;
  readonly buildingTypeId: string;
  readonly duration: number;

  /**
   * @param occurredAt - Simulation time when construction started.
   * @param buildingId - Building identifier.
   * @param companyId - Owning company identifier.
   * @param buildingTypeId - Building type identifier.
   * @param duration - Total construction duration in simulation time units.
   */
  constructor(
    occurredAt: number,
    buildingId: string,
    companyId: string,
    buildingTypeId: string,
    duration: number,
  ) {
    super(occurredAt);
    this.buildingId = buildingId;
    this.companyId = companyId;
    this.buildingTypeId = buildingTypeId;
    this.duration = duration;
    this.freeze();
  }
}
