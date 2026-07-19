/**
 * @module @application/read-models/CityReadModel
 *
 * Read-side projection of city runtime state.
 */

/** Immutable city data returned by queries. */
export type CityReadModel = {
  readonly id: string;
  readonly name: string;
  readonly regionId: string;
  readonly category: string;
};
