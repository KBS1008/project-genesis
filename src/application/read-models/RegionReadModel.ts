/**
 * @module @application/read-models/RegionReadModel
 *
 * Read-side projection of region runtime state.
 */

/** Immutable region data returned by queries. */
export type RegionReadModel = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly worldId: string;
  readonly biomeId: string;
  readonly mapX: number;
  readonly mapY: number;
  readonly neighborRegionIds: readonly string[];
  readonly cityIds: readonly string[];
};
