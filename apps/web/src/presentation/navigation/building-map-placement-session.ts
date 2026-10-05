export type BuildingMapPlacementSession = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly canPlace: boolean;
  readonly candidate: { readonly x: number; readonly y: number } | null;
};

export function createBuildingMapPlacementSession(params: {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly canPlace: boolean;
}): BuildingMapPlacementSession {
  return Object.freeze({
    buildingTypeId: params.buildingTypeId,
    name: params.name.trim(),
    canPlace: params.canPlace,
    candidate: null,
  });
}

export function withBuildingMapPlacementCandidate(
  session: BuildingMapPlacementSession,
  candidate: { readonly x: number; readonly y: number } | null,
): BuildingMapPlacementSession {
  return Object.freeze({
    ...session,
    candidate,
  });
}
