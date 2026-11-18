/** Request body for regional placement validation (preview only). */
export type ValidateBuildingPlacementDto = {
  readonly buildingTypeId: string;
  readonly regionId: string;
  readonly x: number;
  readonly y: number;
};
