/**
 * @module @domain/brain/CompanyDecisionType
 *
 * Executable decision types produced by company planning.
 */

/** Supported company decision types. */
export const CompanyDecisionType = {
  PURCHASE_RESOURCE: 'PURCHASE_RESOURCE',
  SELL_RESOURCE: 'SELL_RESOURCE',
  START_PRODUCTION: 'START_PRODUCTION',
  PLACE_BUILDING: 'PLACE_BUILDING',
  START_RESEARCH: 'START_RESEARCH',
  EXPAND_REGION: 'EXPAND_REGION',
} as const;

/** Union of all company decision type values. */
export type CompanyDecisionType =
  (typeof CompanyDecisionType)[keyof typeof CompanyDecisionType];

/** All supported decision types in deterministic order. */
export const COMPANY_DECISION_TYPES: readonly CompanyDecisionType[] = Object.freeze([
  CompanyDecisionType.EXPAND_REGION,
  CompanyDecisionType.PLACE_BUILDING,
  CompanyDecisionType.PURCHASE_RESOURCE,
  CompanyDecisionType.SELL_RESOURCE,
  CompanyDecisionType.START_PRODUCTION,
  CompanyDecisionType.START_RESEARCH,
]);

/** Returns whether a value is a supported company decision type. */
export function isCompanyDecisionType(value: string): value is CompanyDecisionType {
  return (COMPANY_DECISION_TYPES as readonly string[]).includes(value);
}
