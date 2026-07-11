/**
 * @module @simulation/systems/production/ProductionJobCompletedHandler
 *
 * Callback invoked when a production job reaches completed status.
 */

import type { ProductionJob } from '../../../domain/production/ProductionJob.js';

/** Handles inventory and downstream reactions to completed production jobs. */
export type ProductionJobCompletedHandler = (job: ProductionJob) => void;
