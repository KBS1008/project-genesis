/**
 * @module @infrastructure/persistence/InMemoryCompanyRepository
 *
 * In-memory implementation of {@link CompanyRepository} for tests and local sessions.
 */

import type { Company } from '../../domain/company/Company.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';

/**
 * Stores company aggregates in memory.
 */
export class InMemoryCompanyRepository implements CompanyRepository {
  readonly #companies = new Map<string, Company>();

  save(company: Company): void {
    this.#companies.set(company.getId().value, company);
  }

  findById(id: CompanyId): Company | undefined {
    return this.#companies.get(id.value);
  }

  findAll(): readonly Company[] {
    return Object.freeze(
      [...this.#companies.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
