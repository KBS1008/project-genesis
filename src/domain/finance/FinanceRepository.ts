/**
 * @module @domain/finance/FinanceRepository
 *
 * Persistence contract for {@link FinanceAccount} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { FinanceAccount } from './FinanceAccount.js';
import type { FinanceAccountId } from './FinanceAccountId.js';

/**
 * Provides access to persisted finance account aggregates.
 */
export interface FinanceRepository {
  /** Persists a finance account aggregate. */
  save(account: FinanceAccount): void;

  /** Returns a finance account by id, or undefined when not found. */
  findById(id: FinanceAccountId): FinanceAccount | undefined;

  /** Returns the finance account owned by a company, if one exists. */
  findByCompanyId(companyId: CompanyId): FinanceAccount | undefined;

  /** Returns all finance accounts in deterministic id order. */
  findAll(): readonly FinanceAccount[];
}
