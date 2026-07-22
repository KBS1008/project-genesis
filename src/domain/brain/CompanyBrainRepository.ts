/**
 * @module @domain/brain/CompanyBrainRepository
 *
 * Persistence contract for {@link CompanyBrain} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { CompanyBrain } from './CompanyBrain.js';
import type { CompanyBrainId } from './CompanyBrainId.js';

/**
 * Provides access to persisted company brain aggregates.
 */
export interface CompanyBrainRepository {
  /** Persists a company brain aggregate. */
  save(brain: CompanyBrain): void;

  /** Returns a company brain by id, or undefined when not found. */
  findById(id: CompanyBrainId): CompanyBrain | undefined;

  /** Returns the brain owned by a company, if one exists. */
  findByCompanyId(companyId: CompanyId): CompanyBrain | undefined;

  /** Returns all persisted company brains in deterministic id order. */
  findAll(): readonly CompanyBrain[];
}
