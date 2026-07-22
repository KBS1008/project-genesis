/**
 * @module @infrastructure/persistence/InMemoryCompanyBrainRepository
 *
 * In-memory implementation of {@link CompanyBrainRepository}.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import type { CompanyBrainId } from '../../domain/brain/CompanyBrainId.js';
import type { CompanyBrainRepository } from '../../domain/brain/CompanyBrainRepository.js';

/**
 * Stores company brain aggregates in memory.
 */
export class InMemoryCompanyBrainRepository implements CompanyBrainRepository {
  readonly #brains = new Map<string, CompanyBrain>();

  save(brain: CompanyBrain): void {
    this.#brains.set(brain.getId().value, brain);
  }

  findById(id: CompanyBrainId): CompanyBrain | undefined {
    return this.#brains.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): CompanyBrain | undefined {
    return [...this.#brains.values()].find(
      (brain) => brain.getCompanyId().value === companyId.value,
    );
  }

  findAll(): readonly CompanyBrain[] {
    return Object.freeze(
      [...this.#brains.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
