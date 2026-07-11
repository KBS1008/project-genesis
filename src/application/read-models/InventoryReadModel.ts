/**
 * @module @application/read-models/InventoryReadModel
 *
 * Read-side projection of inventory aggregate state.
 */

/** One resource line in an inventory read model. */
export type InventoryItemReadModel = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly reserved: number;
  readonly available: number;
};

/** Immutable inventory data returned by queries. */
export type InventoryReadModel = {
  readonly id: string;
  readonly companyId: string;
  readonly status: string;
  readonly items: readonly InventoryItemReadModel[];
};
