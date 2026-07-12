/**
 * @module @application/queries/ListFinanceTransactionsQueryHandler
 *
 * Reads finance ledger entries without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { FinanceTransaction } from '../../domain/finance/FinanceTransaction.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { FinanceTransactionReadModel } from '../read-models/FinanceTransactionReadModel.js';
import type { ListFinanceTransactionsQuery } from './ListFinanceTransactionsQuery.js';

/** Dependencies required by {@link ListFinanceTransactionsQueryHandler}. */
export type ListFinanceTransactionsQueryHandlerDependencies = Pick<
  ApplicationContext,
  'financeRepository'
>;

/**
 * Returns finance ledger entries for one company, newest first.
 */
export class ListFinanceTransactionsQueryHandler {
  readonly #financeRepository: ListFinanceTransactionsQueryHandlerDependencies['financeRepository'];

  /**
   * @param dependencies - Repository access for finance lookup.
   */
  constructor(dependencies: ListFinanceTransactionsQueryHandlerDependencies) {
    this.#financeRepository = dependencies.financeRepository;
  }

  /**
   * Executes the list-finance-transactions query.
   *
   * @param query - Company lookup input.
   */
  execute(
    query: ListFinanceTransactionsQuery,
  ): Result<readonly FinanceTransactionReadModel[], ValidationError> {
    const companyIdResult = createCompanyId(query.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const account = this.#financeRepository.findByCompanyId(companyIdResult.value);

    if (account === undefined) {
      return Result.fail(
        new ValidationError(
          `Finance account for company "${companyIdResult.value.value}" was not found.`,
        ),
      );
    }

    const transactions = account
      .getTransactions()
      .map(mapFinanceTransaction)
      .sort((left, right) => right.timestamp - left.timestamp || right.id.localeCompare(left.id));

    return Result.ok(Object.freeze(transactions));
  }
}

function mapFinanceTransaction(transaction: FinanceTransaction): FinanceTransactionReadModel {
  return Object.freeze({
    id: transaction.id.value,
    financeId: transaction.financeId,
    companyId: transaction.companyId,
    transactionType: transaction.transactionType,
    direction: transaction.direction,
    amount: transaction.amount,
    balanceBefore: transaction.balanceBefore,
    balanceAfter: transaction.balanceAfter,
    reservedCashDelta: transaction.reservedCashDelta,
    timestamp: transaction.timestamp,
  });
}
