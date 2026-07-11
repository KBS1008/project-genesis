/**
 * @module @domain/inventory/events/InventoryChanged
 *
 * Domain event raised when inventory quantities change.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that an inventory resource quantity changed.
 */
export class InventoryChanged extends DomainEvent {
  readonly eventName = 'InventoryChanged';
  readonly inventoryId: string;
  readonly companyId: string;
  readonly resourceId: string;
  readonly quantity: number;
  readonly reserved: number;

  /**
   * @param occurredAt - Simulation time when the inventory changed.
   * @param inventoryId - Inventory identifier value.
   * @param companyId - Owning company identifier value.
   * @param resourceId - Resource type identifier value.
   * @param quantity - Total quantity after the change.
   * @param reserved - Reserved quantity after the change.
   */
  constructor(
    occurredAt: number,
    inventoryId: string,
    companyId: string,
    resourceId: string,
    quantity: number,
    reserved: number,
  ) {
    super(occurredAt);
    this.inventoryId = inventoryId;
    this.companyId = companyId;
    this.resourceId = resourceId;
    this.quantity = quantity;
    this.reserved = reserved;
    this.freeze();
  }
}
