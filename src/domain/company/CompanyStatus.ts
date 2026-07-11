/**
 * @module @domain/company/CompanyStatus
 *
 * Lifecycle status of a company aggregate.
 *
 * @see docs/schemas/Company.Schema.md
 */

/** Valid company lifecycle states. */
export const CompanyStatus = {
  ACTIVE: 'ACTIVE',
  VACATION: 'VACATION',
  BANKRUPT: 'BANKRUPT',
  LIQUIDATED: 'LIQUIDATED',
  BANNED: 'BANNED',
} as const;

/** Union of all company status values. */
export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus];
