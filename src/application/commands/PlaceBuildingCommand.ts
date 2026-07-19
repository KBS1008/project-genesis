/**
 * @module @application/commands/PlaceBuildingCommand
 *
 * Input for placing a new building.
 */

/** Command to place a new building aggregate. */
export type PlaceBuildingCommand = {
  readonly buildingId: string;
  readonly buildingTypeId: string;
  readonly companyId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly regionId?: string;
};
