/**
 * @module @domain/research/ResearchJobRepository
 *
 * Persistence contract for {@link ResearchJob} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { ResearchJob } from './ResearchJob.js';
import type { ResearchJobId } from './ResearchJobId.js';

/**
 * Provides access to persisted research job aggregates.
 */
export interface ResearchJobRepository {
  /** Persists a research job aggregate. */
  save(job: ResearchJob): void;

  /** Returns a research job by id, or undefined when not found. */
  findById(id: ResearchJobId): ResearchJob | undefined;

  /** Returns all running research jobs in deterministic id order. */
  findRunning(): readonly ResearchJob[];

  /** Returns all persisted research jobs in deterministic id order. */
  findAll(): readonly ResearchJob[];

  /** Returns research jobs for a company in deterministic id order. */
  findByCompanyId(companyId: CompanyId): readonly ResearchJob[];
}
