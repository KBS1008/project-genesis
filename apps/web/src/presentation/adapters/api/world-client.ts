/** HTTP read helpers for world map and city queries. */

import { callApi } from './client';

export type WorldMapDto = {
  readonly id: string;
  readonly name: string;
  readonly regions: readonly {
    readonly regionId: string;
    readonly x: number;
    readonly y: number;
  }[];
  readonly connections: readonly {
    readonly fromRegionId: string;
    readonly toRegionId: string;
    readonly distance: number;
  }[];
};

export type CityDto = {
  readonly id: string;
  readonly name: string;
  readonly regionId: string;
  readonly category: string;
};

/** Loads abstract world map connectivity for the active session. */
export function fetchWorldMap(): Promise<WorldMapDto> {
  return callApi<WorldMapDto>('/api/world/map');
}

/** Lists cities, optionally filtered by region. */
export function fetchCities(regionId?: string): Promise<readonly CityDto[]> {
  const query =
    regionId === undefined || regionId.length === 0
      ? ''
      : `?regionId=${encodeURIComponent(regionId)}`;
  return callApi<readonly CityDto[]>(`/api/world/cities${query}`);
}
