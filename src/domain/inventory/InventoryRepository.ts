/**
 * @module @domain/inventory/InventoryRepository
 *
 * Persistence contract for {@link Inventory} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { Inventory } from './Inventory.js';
import type { InventoryId } from './InventoryId.js';

/**
 * Provides access to persisted inventory aggregates.
 */
export interface InventoryRepository {
  /** Persists an inventory aggregate. */
  save(inventory: Inventory): void;

  /** Returns an inventory by id, or undefined when not found. */
  findById(id: InventoryId): Inventory | undefined;

  /** Returns the inventory owned by a company, if one exists. */
  findByCompanyId(companyId: CompanyId): Inventory | undefined;

  /** Returns all persisted inventories in deterministic id order. */
  findAll(): readonly Inventory[];
}
