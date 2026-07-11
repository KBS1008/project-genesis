/**
 * @module @domain/production/ProductionJobStatus
 *
 * Lifecycle status of a production job.
 */

/** Production job states from the production schema. */
export const ProductionJobStatus = {
  WAITING: 'WAITING',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
} as const;

export type ProductionJobStatus =
  (typeof ProductionJobStatus)[keyof typeof ProductionJobStatus];
