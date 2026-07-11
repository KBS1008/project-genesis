/**
 * @module @application/commands/StartProductionCommand
 *
 * Input for starting a production job on a building.
 */

/** Command to start production for a recipe on a building. */
export type StartProductionCommand = {
  readonly jobId: string;
  readonly buildingId: string;
  readonly recipeId: string;
};
