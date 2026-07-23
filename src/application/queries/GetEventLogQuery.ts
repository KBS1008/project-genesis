/** Query input for event log reads. */
export type GetEventLogQuery = {
  readonly companyId?: string;
  readonly limit?: number;
};
