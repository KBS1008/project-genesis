/**
 * @module @application/queries/GetFinanceQuery
 *
 * Input for retrieving a company finance account.
 */

/** Query to read finance state for one company. */
export type GetFinanceQuery = {
  readonly companyId: string;
};
