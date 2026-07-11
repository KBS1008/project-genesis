/**
 * @module @application/queries/ListBuildingsQuery
 *
 * Input for listing buildings owned by a company.
 */

/** Query to read all buildings for one company. */
export type ListBuildingsQuery = {
  readonly companyId: string;
};
