/**
 * @module @domain/finance/FinanceTransaction
 *
 * Immutable snapshot of one finance ledger entry.
 */

import type { FinanceTransactionDirection } from './FinanceTransactionDirection.js';
import type { FinanceTransactionId } from './FinanceTransactionId.js';
import type { FinanceTransactionType } from './FinanceTransactionType.js';

/** One recorded finance transaction belonging to a finance account. */
export type FinanceTransaction = {
  readonly id: FinanceTransactionId;
  readonly financeId: string;
  readonly companyId: string;
  readonly transactionType: FinanceTransactionType;
  readonly direction: FinanceTransactionDirection;
  readonly amount: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly reservedCashDelta: number;
  readonly timestamp: number;
};
