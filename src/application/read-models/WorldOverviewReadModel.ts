/**
 * @module @application/read-models/WorldOverviewReadModel
 *
 * Read-side projection of bootstrapped world context.
 */

/** Immutable world overview returned by queries. */
export type WorldOverviewReadModel = {
  readonly activeWorldId: string;
  readonly worldName: string;
  readonly regionIds: readonly string[];
  readonly regionCount: number;
  readonly cityCount: number;
  readonly defaultMapId: string;
};
