/** HTTP DTOs and fetch helpers for M9 read-model queries. */

import { callApi } from './client';

export type SessionStatusDto = {
  readonly hasActiveSession: boolean;
  readonly companyId: string | null;
  readonly companyName: string | null;
  readonly playerId: string | null;
  readonly savePath: string;
};

export type SimulationStatusDto = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly isPaused: boolean;
  readonly tickDuration: number;
  readonly hasActiveSession: boolean;
};

export type SaveMetadataDto = {
  readonly filePath: string;
  readonly fileName: string;
  readonly schemaVersion: number | null;
  readonly tickNumber: number | null;
  readonly companyName: string | null;
  readonly modifiedAt: number | null;
};

export type WorldOverviewDto = {
  readonly activeWorldId: string;
  readonly worldName: string;
  readonly regionIds: readonly string[];
  readonly regionCount: number;
  readonly cityCount: number;
  readonly defaultMapId: string;
};

export type RegionDto = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly worldId: string;
  readonly biomeId: string;
  readonly mapX: number;
  readonly mapY: number;
  readonly neighborRegionIds: readonly string[];
  readonly cityIds: readonly string[];
};

export type RegionalResourceDto = {
  readonly resourceTypeId: string;
  readonly available: number;
  readonly extractionModifier: number;
};

export type CityDto = {
  readonly id: string;
  readonly name: string;
  readonly regionId: string;
  readonly category: string;
};

export type RegionDetailsDto = {
  readonly region: RegionDto;
  readonly regionalResources: readonly RegionalResourceDto[];
  readonly cities: readonly CityDto[];
};

export type EventLogEntryDto = {
  readonly id: string;
  readonly tickNumber: number;
  readonly occurredAt: number;
  readonly category: string;
  readonly message: string;
  readonly severity: 'INFO' | 'WARNING' | 'ERROR';
};

export function fetchSessionStatus(): Promise<SessionStatusDto> {
  return callApi<SessionStatusDto>('/api/session/status');
}

export function fetchSimulationStatus(): Promise<SimulationStatusDto> {
  return callApi<SimulationStatusDto>('/api/simulation/status');
}

export function fetchSaveList(): Promise<readonly SaveMetadataDto[]> {
  return callApi<readonly SaveMetadataDto[]>('/api/saves');
}

export function fetchWorldOverview(): Promise<WorldOverviewDto> {
  return callApi<WorldOverviewDto>('/api/world/overview');
}

export function fetchRegionList(): Promise<readonly RegionDto[]> {
  return callApi<readonly RegionDto[]>('/api/world/regions');
}

export function fetchRegionDetails(regionId: string): Promise<RegionDetailsDto> {
  return callApi<RegionDetailsDto>(`/api/world/regions/${encodeURIComponent(regionId)}`);
}

export function fetchEventLog(limit = 50): Promise<readonly EventLogEntryDto[]> {
  return callApi<readonly EventLogEntryDto[]>(`/api/events/log?limit=${limit}`);
}

export function fetchMarketPrices(regionId?: string): Promise<readonly import('./client').MarketPriceReadModel[]> {
  const query = regionId === undefined ? '' : `?regionId=${encodeURIComponent(regionId)}`;
  return callApi(`/api/markets/prices${query}`);
}

export function fetchProductionJobs(): Promise<readonly import('./client').ProductionJobSessionReadModel[]> {
  return callApi('/api/production/jobs');
}

export function fetchResearchJobs(): Promise<readonly import('./client').ResearchJobSessionReadModel[]> {
  return callApi('/api/research/jobs');
}

export function fetchTransportOrders(): Promise<readonly import('./client').TransportOrderSessionReadModel[]> {
  return callApi('/api/transport/orders');
}

export function fetchFinanceTransactions(): Promise<readonly import('./client').FinanceTransactionReadModel[]> {
  return callApi('/api/finance/transactions');
}

export function fetchBuildingList(): Promise<readonly import('./client').BuildingReadModel[]> {
  return callApi('/api/buildings');
}
