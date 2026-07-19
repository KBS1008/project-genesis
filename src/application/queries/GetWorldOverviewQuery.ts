/**
 * @module @application/queries/GetWorldOverviewQuery
 *
 * Query input for reading bootstrapped world overview data.
 */

/** Parameters for {@link GetWorldOverviewQueryHandler}. */
export type GetWorldOverviewQuery = {
  readonly worldId?: string;
};
