/**
 * @module @domain/finance/FinanceTransactionDirection
 *
 * Direction of a finance ledger entry.
 *
 * @see docs/schemas/FinanceTransaction.Schema.md
 */

/** Direction indicating how a transaction affects cash balance. */
export enum FinanceTransactionDirection {
  IN = 'IN',
  OUT = 'OUT',
  NONE = 'NONE',
}
