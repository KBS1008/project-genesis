/**
 * @module @application/read-models/FinanceTransactionReadModel
 *
 * Read-side projection of one finance ledger entry.
 */

/** Immutable finance transaction returned by queries. */
export type FinanceTransactionReadModel = {
  readonly id: string;
  readonly financeId: string;
  readonly companyId: string;
  readonly transactionType: string;
  readonly direction: string;
  readonly amount: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly reservedCashDelta: number;
  readonly timestamp: number;
};
