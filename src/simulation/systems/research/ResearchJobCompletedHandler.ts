/**
 * @module @simulation/systems/research/ResearchJobCompletedHandler
 *
 * Callback invoked when a research job reaches completed status.
 */

import type { ResearchJob } from '../../../domain/research/ResearchJob.js';

/** Handles technology unlock when a research job completes. */
export type ResearchJobCompletedHandler = (job: ResearchJob) => void;
