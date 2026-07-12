/**
 * @module @application/commands/StartResearchCommand
 *
 * Input for starting a timed technology research job.
 */

/** Command payload for {@link StartResearchUseCase}. */
export type StartResearchCommand = {
  readonly jobId: string;
  readonly companyId: string;
  readonly technologyId: string;
};
