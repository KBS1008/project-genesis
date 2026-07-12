/**
 * @module @domain/milestone/CompanyMilestonesRepository
 *
 * Persistence contract for {@link CompanyMilestones} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { CompanyMilestones } from './CompanyMilestones.js';
import type { CompanyMilestonesId } from './CompanyMilestonesId.js';

/**
 * Provides access to persisted company milestones aggregates.
 */
export interface CompanyMilestonesRepository {
  /** Persists a company milestones aggregate. */
  save(milestones: CompanyMilestones): void;

  /** Returns company milestones by id, or undefined when not found. */
  findById(id: CompanyMilestonesId): CompanyMilestones | undefined;

  /** Returns the milestones module owned by a company, if one exists. */
  findByCompanyId(companyId: CompanyId): CompanyMilestones | undefined;

  /** Returns all persisted company milestones modules in deterministic id order. */
  findAll(): readonly CompanyMilestones[];
}
