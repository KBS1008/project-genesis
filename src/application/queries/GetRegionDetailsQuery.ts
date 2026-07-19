/**
 * @module @application/queries/GetRegionDetailsQuery
 *
 * Query input for reading one region with local context.
 */

/** Parameters for {@link GetRegionDetailsQueryHandler}. */
export type GetRegionDetailsQuery = {
  readonly regionId: string;
};
