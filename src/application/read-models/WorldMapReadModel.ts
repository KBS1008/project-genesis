/**
 * @module @application/read-models/WorldMapReadModel
 *
 * Read-side projection of abstract world map connectivity.
 */

/** Region placement on the abstract map. */
export type WorldMapRegionReadModel = {
  readonly regionId: string;
  readonly x: number;
  readonly y: number;
};

/** Direct connection between two regions. */
export type WorldMapConnectionReadModel = {
  readonly fromRegionId: string;
  readonly toRegionId: string;
  readonly distance: number;
};

/** Immutable world map data returned by queries. */
export type WorldMapReadModel = {
  readonly id: string;
  readonly name: string;
  readonly regions: readonly WorldMapRegionReadModel[];
  readonly connections: readonly WorldMapConnectionReadModel[];
};
