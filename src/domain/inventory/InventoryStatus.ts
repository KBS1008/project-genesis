/**
 * @module @domain/inventory/InventoryStatus
 *
 * Lifecycle status of a company inventory.
 */

/** Inventory lifecycle states from the inventory schema. */
export const InventoryStatus = {
  ACTIVE: 'ACTIVE',
  LOCKED: 'LOCKED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type InventoryStatus = (typeof InventoryStatus)[keyof typeof InventoryStatus];
