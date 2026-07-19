/**
 * @module @application/queries/GetRegionalResourcesQuery
 *
 * Input for reading regional resource availability.
 */

/** Query to read regional resources for one region. */
export type GetRegionalResourcesQuery = {
  readonly regionId: string;
};
