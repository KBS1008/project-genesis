/**
 * @module @application/read-models/CompanyReadModel
 *
 * Read-side projection of company aggregate state.
 */

/** Immutable company data returned by queries. */
export type CompanyReadModel = {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly foundedAt: number;
  readonly status: string;
};
