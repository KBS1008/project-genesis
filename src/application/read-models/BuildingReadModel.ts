/**
 * @module @application/read-models/BuildingReadModel
 *
 * Read-side projection of building aggregate state.
 */

/** Immutable building data returned by queries. */
export type BuildingReadModel = {
  readonly id: string;
  readonly buildingTypeId: string;
  readonly companyId: string;
  readonly regionId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly level: number;
  readonly createdAt: number;
  readonly status: string;
  readonly constructionProgress: number;
  readonly constructionDuration: number;
};
