/**
 * @module @infrastructure/persistence/InMemoryProductionJobRepository
 *
 * In-memory implementation of {@link ProductionJobRepository}.
 */

import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import type { ProductionJob } from '../../domain/production/ProductionJob.js';
import type { ProductionJobId } from '../../domain/production/ProductionJobId.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';

/**
 * Stores production job aggregates in memory.
 */
export class InMemoryProductionJobRepository implements ProductionJobRepository {
  readonly #jobs = new Map<string, ProductionJob>();

  save(job: ProductionJob): void {
    this.#jobs.set(job.getId().value, job);
  }

  findById(id: ProductionJobId): ProductionJob | undefined {
    return this.#jobs.get(id.value);
  }

  findRunning(): readonly ProductionJob[] {
    return Object.freeze(
      [...this.#jobs.values()]
        .filter((job) => job.getStatus() === ProductionJobStatus.RUNNING)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }
}
