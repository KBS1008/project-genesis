/**
 * @module @application/queries/ListFinanceTransactionsQuery
 *
 * Input for listing finance ledger entries for one company.
 */

/** Query input for finance transaction listing. */
export type ListFinanceTransactionsQuery = {
  readonly companyId: string;
};
