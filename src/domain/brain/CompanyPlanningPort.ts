/**
 * @module @domain/brain/CompanyPlanningPort
 *
 * Simulation port for deterministic company planning.
 */

import type { CompanyId } from '../company/CompanyId.js';

/** Executes company planning for one company on a simulation tick. */
export interface CompanyPlanningPort {
  /** Runs planning for one company at the given tick number. */
  run(companyId: CompanyId, tickNumber: number): void;
}
