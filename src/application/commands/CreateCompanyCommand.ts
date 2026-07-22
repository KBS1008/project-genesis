/**
 * @module @application/commands/CreateCompanyCommand
 *
 * Input for founding a new company.
 */

/** Command to create a new company aggregate. */
export type CreateCompanyCommand = {
  readonly companyId: string;
  readonly name: string;
  readonly ownerId: string;
  readonly autonomous?: boolean;
  readonly strategyDefinitionId?: string;
};
