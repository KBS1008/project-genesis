/**
 * @module @application/queries/GetWorldMapQuery
 *
 * Input for reading one world map graph.
 */

/** Query to read a world map by id. */
export type GetWorldMapQuery = {
  readonly mapId: string;
};
