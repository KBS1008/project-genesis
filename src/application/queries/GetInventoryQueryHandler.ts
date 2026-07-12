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
export type GetInventoryQueryHandlerDependencies = Pick<ApplicationContext, 'inventoryRepository'>;

/**
 * Returns a read model for one company inventory.
 */
export class GetInventoryQueryHandler {
  readonly #inventoryRepository: GetInventoryQueryHandlerDependencies['inventoryRepository'];

  /**
   * @param dependencies - Repository access for inventory lookup.
   */
  constructor(dependencies: GetInventoryQueryHandlerDependencies) {
    this.#inventoryRepository = dependencies.inventoryRepository;
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

    return Result.ok(mapInventory(inventory));
  }
}

function mapInventory(inventory: Inventory): InventoryReadModel {
  return Object.freeze({
    id: inventory.getId().value,
    companyId: inventory.getCompanyId().value,
    status: inventory.getStatus(),
    items: Object.freeze(
      inventory.getItems().map((item) =>
        Object.freeze({
          resourceId: item.resourceId.value,
          quantity: item.quantity,
          reserved: item.reserved,
          available: Math.max(0, item.quantity - item.reserved),
        }),
      ),
    ),
  });
}
