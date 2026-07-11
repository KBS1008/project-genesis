/**
 * @module @application/read-models/FinanceReadModel
 *
 * Read-side projection of finance account state.
 */

/** Immutable finance account data returned by queries. */
export type FinanceReadModel = {
  readonly id: string;
  readonly companyId: string;
  readonly currency: string;
  readonly cashBalance: number;
  readonly reservedCash: number;
  readonly availableCash: number;
};
