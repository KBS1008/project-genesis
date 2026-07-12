/**
 * @module @domain/research/CompanyResearchRepository
 *
 * Persistence contract for {@link CompanyResearch} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { CompanyResearch } from './CompanyResearch.js';
import type { CompanyResearchId } from './CompanyResearchId.js';

/**
 * Provides access to persisted company research aggregates.
 */
export interface CompanyResearchRepository {
  /** Persists a company research aggregate. */
  save(research: CompanyResearch): void;

  /** Returns company research by id, or undefined when not found. */
  findById(id: CompanyResearchId): CompanyResearch | undefined;

  /** Returns the research module owned by a company, if one exists. */
  findByCompanyId(companyId: CompanyId): CompanyResearch | undefined;

  /** Returns all persisted company research modules in deterministic id order. */
  findAll(): readonly CompanyResearch[];
}
