/**
 * @module @project-genesis/api/game/dto/place-building.dto
 */

/** Request body for placing a building. */
export type PlaceBuildingDto = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
};
