export type BuildingMapPlacementValidation = {
  readonly valid: boolean;
  readonly reason: string | null;
};

export type BuildingMapPlacementSession = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly canPlace: boolean;
  readonly candidate: { readonly x: number; readonly y: number } | null;
  readonly validation: BuildingMapPlacementValidation | null;
  readonly regionId: string | null;
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
    validation: null,
    regionId: null,
  });
}

export function withBuildingMapPlacementCandidate(
  session: BuildingMapPlacementSession,
  candidate: { readonly x: number; readonly y: number } | null,
): BuildingMapPlacementSession {
  if (candidate === null) {
    return Object.freeze({
      ...session,
      candidate: null,
      validation: null,
    });
  }

  if (
    session.candidate !== null &&
    session.candidate.x === candidate.x &&
    session.candidate.y === candidate.y
  ) {
    return session;
  }

  return Object.freeze({
    ...session,
    candidate,
    validation: null,
  });
}

export function withBuildingMapPlacementValidation(
  session: BuildingMapPlacementSession,
  validation: BuildingMapPlacementValidation | null,
): BuildingMapPlacementSession {
  return Object.freeze({
    ...session,
    validation,
  });
}

export function withBuildingMapPlacementRegion(
  session: BuildingMapPlacementSession,
  regionId: string | null,
): BuildingMapPlacementSession {
  return Object.freeze({
    ...session,
    regionId,
    candidate: null,
    validation: null,
  });
}
