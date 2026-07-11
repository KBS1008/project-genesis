/**
 * @module @domain/inventory/InventoryItem
 *
 * Immutable snapshot of one resource line in an inventory.
 */

import type { ResourceTypeId } from '../shared/ResourceTypeId.js';

/** One resource entry within an inventory aggregate. */
export type InventoryItem = {
  readonly resourceId: ResourceTypeId;
  readonly quantity: number;
  readonly reserved: number;
};

/** Returns the available quantity for an inventory item. */
export function getAvailableQuantity(item: InventoryItem): number {
  return item.quantity - item.reserved;
}
