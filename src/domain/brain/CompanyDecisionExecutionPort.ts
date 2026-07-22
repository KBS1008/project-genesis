/**
 * @module @domain/brain/CompanyDecisionExecutionPort
 *
 * Simulation port for executing queued company decisions.
 */

import type { CompanyId } from '../company/CompanyId.js';

/** Drains pending company decisions through application use cases. */
export interface CompanyDecisionExecutionPort {
  /** Executes pending decisions for one company. */
  executePendingDecisions(companyId: CompanyId): void;
}
