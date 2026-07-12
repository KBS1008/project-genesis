/**
 * @module @domain/production/ProductionJobRepository
 *
 * Persistence contract for {@link ProductionJob} aggregate roots.
 */

import type { BuildingId } from '../building/BuildingId.js';
import type { ProductionJob } from './ProductionJob.js';
import type { ProductionJobId } from './ProductionJobId.js';

/**
 * Provides access to persisted production job aggregates.
 */
export interface ProductionJobRepository {
  /** Persists a production job aggregate. */
  save(job: ProductionJob): void;

  /** Returns a production job by id, or undefined when not found. */
  findById(id: ProductionJobId): ProductionJob | undefined;

  /** Returns all running production jobs in deterministic id order. */
  findRunning(): readonly ProductionJob[];

  /** Returns all persisted production jobs in deterministic id order. */
  findAll(): readonly ProductionJob[];
}
