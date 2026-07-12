/**
 * @module @infrastructure/persistence/InMemoryResearchJobRepository
 *
 * In-memory implementation of {@link ResearchJobRepository}.
 */

import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';
import type { ResearchJob } from '../../domain/research/ResearchJob.js';
import type { ResearchJobId } from '../../domain/research/ResearchJobId.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';

/**
 * Stores research job aggregates in memory.
 */
export class InMemoryResearchJobRepository implements ResearchJobRepository {
  readonly #jobs = new Map<string, ResearchJob>();

  save(job: ResearchJob): void {
    this.#jobs.set(job.getId().value, job);
  }

  findById(id: ResearchJobId): ResearchJob | undefined {
    return this.#jobs.get(id.value);
  }

  findRunning(): readonly ResearchJob[] {
    return Object.freeze(
      [...this.#jobs.values()]
        .filter((job) => job.getStatus() === ResearchJobStatus.RUNNING)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }

  findAll(): readonly ResearchJob[] {
    return Object.freeze(
      [...this.#jobs.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }

  findByCompanyId(companyId: CompanyId): readonly ResearchJob[] {
    return Object.freeze(
      [...this.#jobs.values()]
        .filter((job) => job.getCompanyId().value === companyId.value)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }
}
