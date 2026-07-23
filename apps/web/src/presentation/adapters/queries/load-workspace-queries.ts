import { fetchDashboard, fetchDashboardHistory } from '@/presentation/adapters/api/client';
import {
  fetchRegionList,
  fetchSaveList,
  fetchSessionStatus,
  fetchSimulationStatus,
  fetchWorldOverview,
} from '@/presentation/adapters/api/query-client';
import { buildCompanyDashboardViewData } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import { buildWorkspaceViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { GameSessionDashboard } from '@/presentation/adapters/api/client';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { WorkspaceViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import type { RegionDto } from '@/presentation/adapters/api/query-client';

export type WorkspaceQueryResult = {
  readonly dashboard: GameSessionDashboard;
  readonly regions: readonly RegionDto[];
  readonly viewData: WorkspaceViewData;
  readonly companyViewData: CompanyDashboardViewData;
  readonly chartPoints: readonly import('@/presentation/adapters/api/client').TickMetricsSnapshot[];
};

/** Loads authoritative workspace queries and maps them to immutable view-data. */
export async function loadWorkspaceQueries(): Promise<WorkspaceQueryResult> {
  const [dashboard, history, session, simulation, worldOverview, regions, saves] = await Promise.all([
    fetchDashboard(),
    fetchDashboardHistory({ limit: 200 }),
    fetchSessionStatus(),
    fetchSimulationStatus(),
    fetchWorldOverview(),
    fetchRegionList(),
    fetchSaveList(),
  ]);

  const chartPoints = history.points;

  return Object.freeze({
    dashboard,
    regions,
    viewData: buildWorkspaceViewData({
      session,
      simulation,
      worldOverview,
      regions,
      saves,
    }),
    companyViewData: buildCompanyDashboardViewData(dashboard, chartPoints),
    chartPoints,
  });
}
