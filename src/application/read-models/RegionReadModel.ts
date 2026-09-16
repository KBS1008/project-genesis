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
  /** Player-facing biome name from authoritative game content. */
  readonly biomeName: string;
  /** Authoritative biome category from game content (presentation / styling). */
  readonly biomeCategory: string;
  readonly mapX: number;
  readonly mapY: number;
  readonly neighborRegionIds: readonly string[];
  readonly cityIds: readonly string[];
};
