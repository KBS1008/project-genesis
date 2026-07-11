/**
 * @module @domain/company/CompanyRepository
 *
 * Persistence contract for {@link Company} aggregate roots.
 *
 * Concrete implementations belong to the Infrastructure layer.
 */

import type { Company } from './Company.js';
import type { CompanyId } from './CompanyId.js';

/**
 * Provides access to persisted company aggregates.
 */
export interface CompanyRepository {
  /** Persists a company aggregate. */
  save(company: Company): void;

  /** Returns a company by id, or undefined when not found. */
  findById(id: CompanyId): Company | undefined;

  /** Returns all companies in deterministic id order. */
  findAll(): readonly Company[];
}
