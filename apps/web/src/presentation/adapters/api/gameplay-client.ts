/** HTTP commands for building, production, and research workflows. */

import { callApi } from './client';

export type PlaceBuildingRequest = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly regionId?: string;
};

export type ValidateBuildingPlacementRequest = {
  readonly buildingTypeId: string;
  readonly regionId: string;
  readonly x: number;
  readonly y: number;
};

export type ValidateBuildingPlacementResponse = {
  readonly valid: boolean;
  readonly reason: string | null;
  readonly geometryVersion: number;
};

export type StartProductionRequest = {
  readonly buildingId: string;
  readonly recipeId: string;
};

export type StartResearchRequest = {
  readonly technologyId: string;
};

/** Places a building for the active company. */
export function placeBuilding(request: PlaceBuildingRequest): Promise<void> {
  return callApi<void>('/api/buildings/place', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Authoritative regional placement preview validation (no mutation). */
export function validateBuildingPlacement(
  request: ValidateBuildingPlacementRequest,
): Promise<ValidateBuildingPlacementResponse> {
  return callApi<ValidateBuildingPlacementResponse>('/api/buildings/validate-placement', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Starts a production job on an active building. */
export function startProduction(request: StartProductionRequest): Promise<void> {
  return callApi<void>('/api/production/start', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Starts a research job for the active company. */
export function startResearch(request: StartResearchRequest): Promise<void> {
  return callApi<void>('/api/research/start', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
