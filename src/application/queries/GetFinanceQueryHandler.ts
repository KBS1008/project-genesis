/**
 * @module @application/queries/GetFinanceQueryHandler
 *
 * Reads finance account state without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { FinanceAccount } from '../../domain/finance/FinanceAccount.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { FinanceReadModel } from '../read-models/FinanceReadModel.js';
import type { GetFinanceQuery } from './GetFinanceQuery.js';

/** Dependencies required by {@link GetFinanceQueryHandler}. */
export type GetFinanceQueryHandlerDependencies = Pick<ApplicationContext, 'financeRepository'>;

/**
 * Returns a read model for one company finance account.
 */
export class GetFinanceQueryHandler {
  readonly #financeRepository: GetFinanceQueryHandlerDependencies['financeRepository'];

  /**
   * @param dependencies - Repository access for finance lookup.
   */
  constructor(dependencies: GetFinanceQueryHandlerDependencies) {
    this.#financeRepository = dependencies.financeRepository;
  }

  /**
   * Executes the get-finance query.
   *
   * @param query - Company lookup input.
   */
  execute(query: GetFinanceQuery): Result<FinanceReadModel, ValidationError> {
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

    return Result.ok(mapFinanceAccount(account));
  }
}

function mapFinanceAccount(account: FinanceAccount): FinanceReadModel {
  return Object.freeze({
    id: account.getId().value,
    companyId: account.getCompanyId().value,
    currency: account.getCurrency(),
    cashBalance: account.getCashBalance(),
    reservedCash: account.getReservedCash(),
    availableCash: account.getAvailableCash(),
  });
}
