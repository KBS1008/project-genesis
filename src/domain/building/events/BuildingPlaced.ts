/**
 * @module @domain/building/events/BuildingPlaced
 *
 * Domain event raised when a building is placed on the company property.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that a building has been placed for construction.
 */
export class BuildingPlaced extends DomainEvent {
  readonly eventName = 'BuildingPlaced';
  readonly buildingId: string;
  readonly companyId: string;
  readonly buildingTypeId: string;
  readonly x: number;
  readonly y: number;

  /**
   * @param occurredAt - Simulation time when the building was placed.
   * @param buildingId - The placed building's identifier value.
   * @param companyId - The owning company's identifier value.
   * @param buildingTypeId - The static building type identifier value.
   * @param x - Horizontal grid coordinate.
   * @param y - Vertical grid coordinate.
   */
  constructor(
    occurredAt: number,
    buildingId: string,
    companyId: string,
    buildingTypeId: string,
    x: number,
    y: number,
  ) {
    super(occurredAt);
    this.buildingId = buildingId;
    this.companyId = companyId;
    this.buildingTypeId = buildingTypeId;
    this.x = x;
    this.y = y;
    this.freeze();
  }
}
