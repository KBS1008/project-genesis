/**
 * @module @domain/research/ResearchJobStatus
 *
 * Lifecycle status of a research job.
 */

/** Research job states from the research gameplay model. */
export const ResearchJobStatus = {
  WAITING: 'WAITING',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
} as const;

export type ResearchJobStatus =
  (typeof ResearchJobStatus)[keyof typeof ResearchJobStatus];
