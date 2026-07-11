/**
 * @module @domain/inventory
 *
 * Inventory bounded context exports.
 */

export { Inventory, createInventoryId } from './Inventory.js';
export type { CreateInventoryParams } from './Inventory.js';
export type { InventoryId } from './InventoryId.js';
export { InventoryStatus } from './InventoryStatus.js';
export type { InventoryItem } from './InventoryItem.js';
export { getAvailableQuantity } from './InventoryItem.js';
export type { InventoryRepository } from './InventoryRepository.js';
export { InventoryChanged } from './events/InventoryChanged.js';
