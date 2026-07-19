/**
 * @module @application/queries/ListCitiesQuery
 *
 * Input for listing cities, optionally filtered by region.
 */

/** Query to list cities. */
export type ListCitiesQuery = {
  readonly regionId?: string;
};
