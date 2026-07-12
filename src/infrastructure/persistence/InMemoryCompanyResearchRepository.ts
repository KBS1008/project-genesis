/**
 * @module @infrastructure/persistence/InMemoryCompanyResearchRepository
 *
 * In-memory implementation of {@link CompanyResearchRepository}.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { CompanyResearch } from '../../domain/research/CompanyResearch.js';
import type { CompanyResearchId } from '../../domain/research/CompanyResearchId.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';

/**
 * Stores company research aggregates in memory.
 */
export class InMemoryCompanyResearchRepository implements CompanyResearchRepository {
  readonly #researchModules = new Map<string, CompanyResearch>();

  save(research: CompanyResearch): void {
    this.#researchModules.set(research.getId().value, research);
  }

  findById(id: CompanyResearchId): CompanyResearch | undefined {
    return this.#researchModules.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): CompanyResearch | undefined {
    return [...this.#researchModules.values()].find(
      (research) => research.getCompanyId().value === companyId.value,
    );
  }

  findAll(): readonly CompanyResearch[] {
    return Object.freeze(
      [...this.#researchModules.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
