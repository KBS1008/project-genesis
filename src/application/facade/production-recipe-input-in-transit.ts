/**
 * @module @application/facade/production-recipe-input-in-transit
 *
 * Read-only in-transit quantities for recipe inputs (P3-LS-S2).
 */

import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import type { RecipeInputAvailabilityReadModel } from './production-recipe-input-availability.js';

/** Minimal transport order fields required for in-transit aggregation. */
export type RecipeInputInTransitTransportOrder = {
  readonly recipeId: string | null;
  readonly resourceId: string;
  readonly amount: number;
  readonly status: string;
};

/**
 * Sums IN_PROGRESS transport amounts for one recipe input.
 */
export function computeRecipeInputInTransitQuantity(
  recipeId: string,
  resourceId: string,
  transportOrders: readonly RecipeInputInTransitTransportOrder[],
): number {
  return transportOrders.reduce((total, order) => {
    if (order.recipeId !== recipeId) {
      return total;
    }

    if (order.resourceId !== resourceId) {
      return total;
    }

    if (order.status !== TransportOrderStatus.IN_PROGRESS) {
      return total;
    }

    if (!Number.isFinite(order.amount) || order.amount <= 0) {
      return total;
    }

    return total + order.amount;
  }, 0);
}

/**
 * Adds {@link RecipeInputAvailabilityReadModel.inTransitQuantity} without changing availability fields.
 */
export function attachRecipeInputInTransitQuantities(
  recipeId: string,
  rows: readonly RecipeInputAvailabilityReadModel[],
  transportOrders: readonly RecipeInputInTransitTransportOrder[],
): readonly RecipeInputAvailabilityReadModel[] {
  return Object.freeze(
    rows.map((row) =>
      Object.freeze({
        ...row,
        inTransitQuantity: computeRecipeInputInTransitQuantity(
          recipeId,
          row.resourceId,
          transportOrders,
        ),
      }),
    ),
  );
}
