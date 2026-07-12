/**
 * @module @application/queries/GetInventoryQueryHandler
 *
 * Reads inventory state without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { Inventory } from '../../domain/inventory/Inventory.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type { GetInventoryQuery } from './GetInventoryQuery.js';

/** Dependencies required by {@link GetInventoryQueryHandler}. */
export type GetInventoryQueryHandlerDependencies = Pick<
  ApplicationContext,
  'inventoryRepository' | 'buildingStorageRepository'
>;

/**
 * Returns a read model for one company inventory.
 */
export class GetInventoryQueryHandler {
  readonly #inventoryRepository: GetInventoryQueryHandlerDependencies['inventoryRepository'];
  readonly #buildingStorageRepository: GetInventoryQueryHandlerDependencies['buildingStorageRepository'];

  /**
   * @param dependencies - Repository access for inventory lookup.
   */
  constructor(dependencies: GetInventoryQueryHandlerDependencies) {
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#buildingStorageRepository = dependencies.buildingStorageRepository;
  }

  /**
   * Executes the get-inventory query.
   *
   * @param query - Company lookup input.
   */
  execute(query: GetInventoryQuery): Result<InventoryReadModel, ValidationError> {
    const companyIdResult = createCompanyId(query.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const inventory = this.#inventoryRepository.findByCompanyId(companyIdResult.value);

    if (inventory === undefined) {
      return Result.fail(
        new ValidationError(
          `Inventory for company "${companyIdResult.value.value}" was not found.`,
        ),
      );
    }

    const warehouseStorages = this.#buildingStorageRepository.findByCompanyId(companyIdResult.value);

    return Result.ok(mapInventory(inventory, warehouseStorages));
  }
}

function mapInventory(
  inventory: Inventory,
  warehouseStorages: ReturnType<
    GetInventoryQueryHandlerDependencies['buildingStorageRepository']['findByCompanyId']
  >,
): InventoryReadModel {
  const merged = new Map<string, { quantity: number; reserved: number }>();

  for (const item of inventory.getItems()) {
    merged.set(item.resourceId.value, {
      quantity: item.quantity,
      reserved: item.reserved,
    });
  }

  for (const storage of warehouseStorages) {
    for (const line of storage.getLines()) {
      const existing = merged.get(line.resourceId) ?? { quantity: 0, reserved: 0 };
      merged.set(line.resourceId, {
        quantity: existing.quantity + line.quantity,
        reserved: existing.reserved + line.reserved,
      });
    }
  }

  return Object.freeze({
    id: inventory.getId().value,
    companyId: inventory.getCompanyId().value,
    status: inventory.getStatus(),
    items: Object.freeze(
      [...merged.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([resourceId, line]) =>
          Object.freeze({
            resourceId,
            quantity: line.quantity,
            reserved: line.reserved,
            available: Math.max(0, line.quantity - line.reserved),
          }),
        ),
    ),
  });
}
