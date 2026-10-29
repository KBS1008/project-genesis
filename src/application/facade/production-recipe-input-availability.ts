/**
 * @module @application/facade/production-recipe-input-availability
 *
 * Side-effect-free input availability rows aligned with production-hint inventory checks.
 */

import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type { WarehouseStorageReadModel } from '../read-models/WarehouseStorageReadModel.js';

/** One recipe input row for dashboard / UI (P2-PC-S1). */
export type RecipeInputAvailabilityReadModel = {
  readonly resourceId: string;
  readonly requiredQuantity: number;
  readonly availableQuantity: number;
  readonly isSufficient: boolean;
};

/** Inventory context used by production hints and input availability. */
export type RecipeInputAvailabilityInventoryContext = {
  readonly inventory: InventoryReadModel;
  readonly warehouseStorage: readonly WarehouseStorageReadModel[];
};

function resolveOnSiteAvailable(
  inventory: InventoryReadModel,
  resourceId: string,
): number {
  return inventory.items.find((item) => item.resourceId === resourceId)?.available ?? 0;
}

function resolveWarehouseAvailable(
  warehouseStorage: readonly WarehouseStorageReadModel[],
  resourceId: string,
): number {
  return warehouseStorage.reduce(
    (total, storage) =>
      total +
      (storage.items.find((item) => item.resourceId === resourceId)?.available ?? 0),
    0,
  );
}

/**
 * Computes per-input availability using the same on-site + warehouse totals as
 * {@link GameSessionDashboardBuilder} missing-input detection.
 */
export function computeRecipeInputAvailability(
  recipeInputs: readonly { readonly resource: string; readonly amount: number }[],
  context: RecipeInputAvailabilityInventoryContext,
): readonly RecipeInputAvailabilityReadModel[] {
  return Object.freeze(
    recipeInputs.map((input) => {
      const onSite = resolveOnSiteAvailable(context.inventory, input.resource);
      const inWarehouse = resolveWarehouseAvailable(context.warehouseStorage, input.resource);
      const availableQuantity = onSite + inWarehouse;
      const requiredQuantity = input.amount;

      return Object.freeze({
        resourceId: input.resource,
        requiredQuantity,
        availableQuantity,
        isSufficient: availableQuantity >= requiredQuantity,
      });
    }),
  );
}
