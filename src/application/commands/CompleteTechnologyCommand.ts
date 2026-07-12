/**
 * @module @application/commands/CompleteTechnologyCommand
 *
 * Input for marking a technology as completed for a company.
 */

/** Command payload for completing a technology. */
export type CompleteTechnologyCommand = {
  readonly companyId: string;
  readonly technologyId: string;
};
