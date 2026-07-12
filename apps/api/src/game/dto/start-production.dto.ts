/**
 * @module @project-genesis/api/game/dto/start-production.dto
 */

/** Request body for starting a production job. */
export type StartProductionDto = {
  readonly buildingId: string;
  readonly recipeId: string;
};
