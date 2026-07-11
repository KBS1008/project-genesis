/**
 * @module @infrastructure/persistence/InMemoryFinanceRepository
 *
 * In-memory implementation of {@link FinanceRepository}.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { FinanceAccount } from '../../domain/finance/FinanceAccount.js';
import type { FinanceAccountId } from '../../domain/finance/FinanceAccountId.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';

/**
 * Stores finance account aggregates in memory.
 */
export class InMemoryFinanceRepository implements FinanceRepository {
  readonly #accounts = new Map<string, FinanceAccount>();

  save(account: FinanceAccount): void {
    this.#accounts.set(account.getId().value, account);
  }

  findById(id: FinanceAccountId): FinanceAccount | undefined {
    return this.#accounts.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): FinanceAccount | undefined {
    return [...this.#accounts.values()].find(
      (account) => account.getCompanyId().value === companyId.value,
    );
  }

  findAll(): readonly FinanceAccount[] {
    return Object.freeze(
      [...this.#accounts.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
