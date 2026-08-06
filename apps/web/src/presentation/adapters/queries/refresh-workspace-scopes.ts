import { fetchDashboard, fetchDashboardHistory } from '@/presentation/adapters/api/client';
import type { GameSessionDashboard } from '@/presentation/adapters/api/client';
import {
  fetchRegionList,
  fetchSaveList,
  fetchSessionStatus,
  fetchSimulationStatus,
  fetchWorldOverview,
  type RegionDto,
  type SaveMetadataDto,
  type SessionStatusDto,
  type SimulationStatusDto,
  type WorldOverviewDto,
} from '@/presentation/adapters/api/query-client';
import { buildCompanyDashboardViewData } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import {
  mapSaveSlotViewData,
  mapSessionStatusViewData,
  mapSimulationStatusViewData,
  mapWorldOverviewViewData,
} from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type {
  SaveSlotViewData,
  SessionStatusViewData,
  SimulationStatusViewData,
  WorldOverviewViewData,
} from '@/presentation/adapters/view-data/workspace-view-data';
import type { WorkspaceQueryScope } from '@/presentation/commands/query-scopes';

export type WorkspaceRefreshInput = {
  readonly scopes: readonly WorkspaceQueryScope[];
  readonly currentSession: SessionStatusViewData;
  readonly currentSimulation: SimulationStatusViewData;
  readonly currentWorld: WorldOverviewViewData | null;
  readonly currentSaves: readonly SaveSlotViewData[];
  readonly currentRegions: readonly RegionDto[];
};

export type WorkspaceRefreshResult = {
  readonly dashboard?: GameSessionDashboard;
  readonly companyViewData?: CompanyDashboardViewData;
  readonly session?: SessionStatusViewData;
  readonly simulation?: SimulationStatusViewData;
  readonly world?: WorldOverviewViewData | null;
  readonly saves?: readonly SaveSlotViewData[];
  readonly regions?: readonly RegionDto[];
};

/** Loads only the workspace slices required by the requested scopes. */
export async function refreshWorkspaceScopes(
  input: WorkspaceRefreshInput,
): Promise<WorkspaceRefreshResult> {
  const scopeSet = new Set(input.scopes);
  const result: WorkspaceRefreshResult = {};

  if (scopeSet.has('workspace.dashboard')) {
    const [dashboard, history] = await Promise.all([
      fetchDashboard(),
      fetchDashboardHistory({ limit: 200 }),
    ]);

    result.dashboard = dashboard;
    result.companyViewData = buildCompanyDashboardViewData(dashboard, history.points);
  }

  const needsSession = scopeSet.has('workspace.session');
  const needsWorld = scopeSet.has('workspace.world');
  const needsSaves = scopeSet.has('workspace.saves');

  if (needsSession) {
    const simulation = await fetchSimulationStatus();
    result.simulation = mapSimulationStatusViewData(simulation);

    const session = await fetchSessionStatus();
    result.session = mapSessionStatusViewData(session);
  }

  if (needsWorld) {
    const [worldOverview, regions] = await Promise.all([
      fetchWorldOverview(),
      fetchRegionList(),
    ]);

    result.world = mapWorldOverviewViewData(worldOverview, regions);
    result.regions = Object.freeze(regions);
  }

  if (needsSaves) {
    const saves = await fetchSaveList();
    result.saves = Object.freeze(saves.map(mapSaveSlotViewData));
  }

  return Object.freeze(result);
}

/** Rebuilds workspace view slices from DTO snapshots for full-session refresh paths. */
export function buildWorkspaceRefreshFromDto(input: {
  readonly session: SessionStatusDto;
  readonly simulation: SimulationStatusDto;
  readonly worldOverview: WorldOverviewDto | null;
  readonly regions: readonly RegionDto[];
  readonly saves: readonly SaveMetadataDto[];
}): Pick<WorkspaceRefreshResult, 'session' | 'simulation' | 'world' | 'saves' | 'regions'> {
  return Object.freeze({
    session: mapSessionStatusViewData(input.session),
    simulation: mapSimulationStatusViewData(input.simulation),
    world:
      input.worldOverview === null
        ? null
        : mapWorldOverviewViewData(input.worldOverview, input.regions),
    saves: Object.freeze(input.saves.map(mapSaveSlotViewData)),
    regions: Object.freeze(input.regions),
  });
}
