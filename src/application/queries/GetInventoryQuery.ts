/**
 * @module @application/queries/GetInventoryQuery
 *
 * Input for retrieving a company inventory.
 */

/** Query to read inventory state for one company. */
export type GetInventoryQuery = {
  readonly companyId: string;
};
