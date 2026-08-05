'use client';

import { useCallback, useMemo } from 'react';
import { mapBuildingListRow } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import { buildExecutiveDashboardViewData } from '@/presentation/adapters/mappers/executive-dashboard-view-mappers';
import { fetchBuildingList } from '@/presentation/adapters/api/query-client';
import {
  PGCompanyWidget,
  PGFinanceWidget,
  PGKpiCard,
  PGNotificationCenter,
  PGProductionWidget,
  PGReportWidget,
  PGResearchWidget,
  PGStatusPanel,
  PGSupplyChainWidget,
} from '@/presentation/components/dashboard';
import { PGDashboardGrid, PGDashboardGridItem, PGInspectorPanel, PGWorkspaceFrame } from '@/presentation/components/layout';
import { buildBuildingNavigationTarget, buildRegionNavigationTarget } from '@/presentation/navigation/entity-navigation';
import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
import { isPrimaryScreenId } from '@/presentation/navigation/primary-screens';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { ExecutiveDashboardCharts } from '@/presentation/screens/company/CompanyOperationsCharts';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import type { EntitySelection } from '@/presentation/state/navigation-state';
import type { EntityDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

function resolveInspectorDetail(
  detailMaps: {
    readonly buildings: ReadonlyMap<string, EntityDetailViewData>;
    readonly productionJobs: ReadonlyMap<string, EntityDetailViewData>;
    readonly transportOrders: ReadonlyMap<string, EntityDetailViewData>;
    readonly researchJobs: ReadonlyMap<string, EntityDetailViewData>;
    readonly employees: ReadonlyMap<string, EntityDetailViewData>;
  },
  selection: EntitySelection,
) {
  if (selection.kind === 'building') {
    return detailMaps.buildings.get(selection.id) ?? null;
  }
  if (selection.kind === 'production') {
    return detailMaps.productionJobs.get(selection.id) ?? null;
  }
  if (selection.kind === 'transport') {
    return detailMaps.transportOrders.get(selection.id) ?? null;
  }
  if (selection.kind === 'research') {
    return detailMaps.researchJobs.get(selection.id) ?? null;
  }
  if (selection.kind === 'employee') {
    return detailMaps.employees.get(selection.id) ?? null;
  }
  return null;
}

/** Executive dashboard assembled from reusable PG widgets (DB-001). */
export function ExecutiveDashboardScreen({
  onOpenOperations,
}: {
  readonly onOpenOperations: () => void;
}) {
  const {
    companyViewData,
    regions,
    viewData,
    navigation,
    navigateToTarget,
    navigateToScreen,
    clearEntitySelection,
  } = useGameWorkspace();

  const regionNames = useMemo(
    () => new Map(regions.map((region) => [region.id, region.name])),
    [regions],
  );

  const tickKey = viewData.simulation.tickNumber ?? 0;

  const loadBuildings = useCallback(
    () =>
      fetchBuildingList().then((buildings) =>
        buildings.map((building) => mapBuildingListRow(building, companyViewData.labels, regionNames)),
      ),
    [companyViewData.labels, regionNames],
  );

  const buildingsQuery = useScreenQuery(
    `executive-dashboard-buildings:${tickKey}`,
    loadBuildings,
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );

  const dashboard = useMemo(() => {
    if (buildingsQuery.data === null) {
      return null;
    }

    return buildExecutiveDashboardViewData(
      companyViewData,
      regions,
      buildingsQuery.data,
      viewData.session.playerId,
    );
  }, [buildingsQuery.data, companyViewData, regions]);

  const inspectorDetail = useMemo(
    () => resolveInspectorDetail(companyViewData.detail, navigation.entitySelection),
    [companyViewData.detail, navigation.entitySelection],
  );

  const handleReportAction = useCallback(
    (actionId: string) => {
      const action = dashboard?.reportActions.find((entry) => entry.id === actionId);
      if (action !== undefined && isPrimaryScreenId(action.targetScreen)) {
        navigateToScreen(action.targetScreen as PrimaryScreenId);
      }
    },
    [dashboard?.reportActions, navigateToScreen],
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={buildingsQuery.isLoading}
      errorMessage={buildingsQuery.errorMessage}
      loadingLabel="Executive Dashboard wird geladen…"
    >
      {dashboard === null ? (
        <EmptyState title="Dashboard-Daten nicht verfügbar." />
      ) : (
        <PGWorkspaceFrame
          inspector={
            inspectorDetail !== null ? (
              <PGInspectorPanel
                title={inspectorDetail.title}
                subtitle={inspectorDetail.subtitle}
                entries={inspectorDetail.entries.map(([label, value, valueClass]) => ({
                  label,
                  value,
                  valueClass,
                }))}
                relatedTitle={inspectorDetail.relatedTitle}
                relatedItems={inspectorDetail.relatedItems}
                onClose={clearEntitySelection}
              />
            ) : undefined
          }
        >
          <div className="pg-executive-dashboard">
            <Card title={dashboard.companyName}>
              <div className="pg-executive-summary">
                <p className="pg-workspace-subtitle">{dashboard.headerSubtitle}</p>
                <p className="pg-workspace-subtitle">
                  {dashboard.playerSummary} · {dashboard.companySummary}
                </p>
                <div className="pg-executive-toolbar">
                  <div className="pg-executive-tabs">
                    <Button className="pg-company-screen-tab is-active" aria-current="page">
                      Executive Dashboard
                    </Button>
                    <Button variant="secondary" className="pg-company-screen-tab" onClick={onOpenOperations}>
                      Operatives Dashboard
                    </Button>
                  </div>
                  <span className="pg-workspace-subtitle">
                    Tick {dashboard.tickLabel} · {dashboard.simulationTimeLabel}
                  </span>
                </div>
              </div>
            </Card>

            {dashboard.kpiCards.length > 0 ? (
              <section aria-label="Kernkennzahlen">
                <div className="pg-kpi-grid">
                  {dashboard.kpiCards.map((card) => (
                    <PGKpiCard
                      key={card.id}
                      label={card.label}
                      value={card.value}
                      hint={card.hint}
                      trend={card.trend}
                      variant={card.variant}
                      placeholder={card.placeholder}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <ExecutiveDashboardCharts
              chartPoints={companyViewData.chartPoints}
              marketPrices={companyViewData.marketPrices}
              labels={companyViewData.labels}
            />

            <PGDashboardGrid>
              <PGDashboardGridItem span={8}>
                <PGCompanyWidget
                  summaryRows={dashboard.companySummaryRows}
                  buildings={dashboard.buildings}
                  regionalPresence={dashboard.regionalPresence}
                  onBuildingClick={(buildingId) => {
                    navigateToTarget(buildBuildingNavigationTarget(buildingId));
                    onOpenOperations();
                  }}
                  onRegionClick={(regionId) => {
                    navigateToTarget(buildRegionNavigationTarget(regionId));
                  }}
                />
              </PGDashboardGridItem>

              <PGDashboardGridItem span={4}>
                <PGStatusPanel items={dashboard.statusItems} />
                <PGNotificationCenter notifications={dashboard.notifications} />
              </PGDashboardGridItem>

              <PGDashboardGridItem span={6}>
                <PGFinanceWidget
                  rows={dashboard.financeRows}
                  transactions={dashboard.recentTransactions.map((transaction) => ({
                    id: transaction.id,
                    cells: [transaction.typeLabel, transaction.amountLabel, transaction.balanceLabel],
                  }))}
                />
              </PGDashboardGridItem>

              <PGDashboardGridItem span={6}>
                <PGProductionWidget
                  activeCount={dashboard.productionJobs.length}
                  hint={dashboard.productionHint ?? undefined}
                  jobs={dashboard.productionJobs}
                />
              </PGDashboardGridItem>

              <PGDashboardGridItem span={6}>
                <PGResearchWidget
                  activeCount={dashboard.researchJobs.length}
                  hint={dashboard.researchHint ?? undefined}
                  jobs={dashboard.researchJobs}
                  completedLabels={dashboard.completedResearchLabels}
                />
              </PGDashboardGridItem>

              <PGDashboardGridItem span={6}>
                <PGSupplyChainWidget
                  activeCount={dashboard.transportOrders.length}
                  hint={dashboard.transportHint ?? undefined}
                  orders={dashboard.transportOrders}
                />
              </PGDashboardGridItem>

              <PGDashboardGridItem span={12}>
                <PGReportWidget
                  actions={dashboard.reportActions}
                  reportHints={dashboard.reportHints}
                  onAction={handleReportAction}
                />
              </PGDashboardGridItem>
            </PGDashboardGrid>
          </div>
        </PGWorkspaceFrame>
      )}
    </ScreenQueryFrame>
  );
}
