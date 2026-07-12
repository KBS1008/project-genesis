/**
 * @module @infrastructure/persistence/InMemoryInventoryRepository
 *
 * In-memory implementation of {@link InventoryRepository}.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { Inventory } from '../../domain/inventory/Inventory.js';
import type { InventoryId } from '../../domain/inventory/InventoryId.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';

/**
 * Stores inventory aggregates in memory.
 */
export class InMemoryInventoryRepository implements InventoryRepository {
  readonly #inventories = new Map<string, Inventory>();

  save(inventory: Inventory): void {
    this.#inventories.set(inventory.getId().value, inventory);
  }

  findById(id: InventoryId): Inventory | undefined {
    return this.#inventories.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): Inventory | undefined {
    return [...this.#inventories.values()].find(
      (inventory) => inventory.getCompanyId().value === companyId.value,
    );
  }

  findAll(): readonly Inventory[] {
    return Object.freeze(
      [...this.#inventories.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
