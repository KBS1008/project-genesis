/**
 * @module @infrastructure/persistence/InMemoryCompanyMilestonesRepository
 *
 * In-memory implementation of {@link CompanyMilestonesRepository}.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { CompanyMilestones } from '../../domain/milestone/CompanyMilestones.js';
import type { CompanyMilestonesId } from '../../domain/milestone/CompanyMilestonesId.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';

/**
 * Stores company milestones aggregates in memory.
 */
export class InMemoryCompanyMilestonesRepository implements CompanyMilestonesRepository {
  readonly #milestonesModules = new Map<string, CompanyMilestones>();

  save(milestones: CompanyMilestones): void {
    this.#milestonesModules.set(milestones.getId().value, milestones);
  }

  findById(id: CompanyMilestonesId): CompanyMilestones | undefined {
    return this.#milestonesModules.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): CompanyMilestones | undefined {
    return [...this.#milestonesModules.values()].find(
      (milestones) => milestones.getCompanyId().value === companyId.value,
    );
  }

  findAll(): readonly CompanyMilestones[] {
    return Object.freeze(
      [...this.#milestonesModules.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
