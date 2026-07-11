/**
 * @module @application/queries/GetCompanyQuery
 *
 * Input for retrieving one company by id.
 */

/** Query to read a single company aggregate. */
export type GetCompanyQuery = {
  readonly companyId: string;
};
