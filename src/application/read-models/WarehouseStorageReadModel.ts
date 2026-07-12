/**
 * @module @application/read-models/WarehouseStorageReadModel
 *
 * Read-side projection of warehouse building storage.
 */

/** One resource line stored in a warehouse building. */
export type WarehouseStorageItemReadModel = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly reserved: number;
  readonly available: number;
};

/** Warehouse stock grouped by building. */
export type WarehouseStorageReadModel = {
  readonly buildingId: string;
  readonly buildingName: string;
  readonly items: readonly WarehouseStorageItemReadModel[];
};
