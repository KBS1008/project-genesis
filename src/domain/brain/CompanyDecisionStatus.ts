/**
 * @module @domain/brain/CompanyDecisionStatus
 *
 * Lifecycle states for queued company decisions.
 */

/** Supported company decision lifecycle states. */
export const CompanyDecisionStatus = {
  PENDING: 'PENDING',
  EXECUTING: 'EXECUTING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

/** Union of all company decision status values. */
export type CompanyDecisionStatus =
  (typeof CompanyDecisionStatus)[keyof typeof CompanyDecisionStatus];

/** All supported decision statuses in deterministic order. */
export const COMPANY_DECISION_STATUSES: readonly CompanyDecisionStatus[] = Object.freeze([
  CompanyDecisionStatus.CANCELLED,
  CompanyDecisionStatus.COMPLETED,
  CompanyDecisionStatus.EXECUTING,
  CompanyDecisionStatus.FAILED,
  CompanyDecisionStatus.PENDING,
]);

/** Returns whether a value is a supported company decision status. */
export function isCompanyDecisionStatus(value: string): value is CompanyDecisionStatus {
  return (COMPANY_DECISION_STATUSES as readonly string[]).includes(value);
}
