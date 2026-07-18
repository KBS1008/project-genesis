/**
 * @module @domain/finance/TaxCalculator
 *
 * Pure corporate tax calculations from finance ledger entries.
 */

import type { FinanceTransaction } from './FinanceTransaction.js';
import { FinanceTransactionDirection } from './FinanceTransactionDirection.js';
import { FinanceTransactionType } from './FinanceTransactionType.js';
import { CORPORATE_TAX_RATE } from './TaxConstants.js';

const REVENUE_TYPES = new Set<FinanceTransactionType>([
  FinanceTransactionType.SALE,
  FinanceTransactionType.NPC_REWARD,
  FinanceTransactionType.RESEARCH_REWARD,
  FinanceTransactionType.CONTRACT_PAYMENT,
]);

const EXPENSE_TYPES = new Set<FinanceTransactionType>([
  FinanceTransactionType.PURCHASE,
  FinanceTransactionType.PRODUCTION_COST,
  FinanceTransactionType.BUILDING_COST,
  FinanceTransactionType.RESEARCH_COST,
  FinanceTransactionType.RECRUITMENT_COST,
  FinanceTransactionType.MAINTENANCE,
  FinanceTransactionType.SALARY,
  FinanceTransactionType.LOAN_PAYMENT,
  FinanceTransactionType.INTEREST,
  FinanceTransactionType.MARKET_FEE,
  FinanceTransactionType.TRANSPORT_COST,
]);

/**
 * Computes taxable profit and tax due for one assessment period.
 */
export class TaxCalculator {
  /**
   * Sums operating revenue minus operating expenses since the last tax timestamp.
   */
  static computeTaxableProfit(
    transactions: readonly FinanceTransaction[],
    sinceTimestamp: number,
  ): number {
    let profit = 0;

    for (const transaction of transactions) {
      if (transaction.timestamp <= sinceTimestamp) {
        continue;
      }

      if (
        transaction.direction === FinanceTransactionDirection.IN &&
        REVENUE_TYPES.has(transaction.transactionType)
      ) {
        profit += transaction.amount;
        continue;
      }

      if (
        transaction.direction === FinanceTransactionDirection.OUT &&
        EXPENSE_TYPES.has(transaction.transactionType)
      ) {
        profit -= transaction.amount;
      }
    }

    return Math.max(0, profit);
  }

  /** Returns the tax amount in credits for a taxable profit base. */
  static computeTaxAmount(taxableProfit: number): number {
    if (taxableProfit === 0) {
      return 0;
    }

    return Math.round(taxableProfit * CORPORATE_TAX_RATE);
  }
}
