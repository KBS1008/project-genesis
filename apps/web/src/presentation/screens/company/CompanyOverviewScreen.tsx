'use client';

import { useCallback, useMemo } from 'react';
import { mapBuildingListRow } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import { buildCompanyOverviewViewData } from '@/presentation/adapters/mappers/company-overview-view-mappers';
import { fetchBuildingList } from '@/presentation/adapters/api/query-client';
import { buildBuildingNavigationTarget, buildRegionNavigationTarget } from '@/presentation/navigation/entity-navigation';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** Phase 6 company inspection screen with inventory, finance, and regional summaries. */
export function CompanyOverviewScreen({
  onOpenOperations,
}: {
  readonly onOpenOperations: () => void;
}) {
  const { companyViewData, regions, viewData, navigateToTarget } = useGameWorkspace();
  const regionNames = useMemo(
    () => new Map(regions.map((region) => [region.id, region.name])),
    [regions],
  );
  const loadBuildings = useCallback(
    () =>
      fetchBuildingList().then((buildings) =>
        buildings.map((building) => mapBuildingListRow(building, companyViewData.labels, regionNames)),
      ),
    [companyViewData.labels, regionNames],
  );
  const buildingsQuery = useScreenQuery('company-overview-buildings', loadBuildings, viewData.session.hasGame);

  const overview = useMemo(() => {
    if (buildingsQuery.data === null) {
      return null;
    }

    return buildCompanyOverviewViewData(companyViewData, regions, buildingsQuery.data);
  }, [buildingsQuery.data, companyViewData, regions]);

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={buildingsQuery.isLoading}
      errorMessage={buildingsQuery.errorMessage}
      loadingLabel="Unternehmensübersicht wird geladen…"
    >
      {overview === null ? (
        <EmptyState title="Unternehmensdaten nicht verfügbar." />
      ) : (
        <div className="pg-screen-placeholder">
          <Card title={overview.companyName}>
            <p className="pg-workspace-subtitle">{overview.headerSubtitle}</p>
            <div className="pg-company-screen-tabs">
              <Button className="pg-company-screen-tab is-active" aria-current="page">
                Übersicht
              </Button>
              <Button variant="secondary" className="pg-company-screen-tab" onClick={onOpenOperations}>
                Operatives Dashboard
              </Button>
            </div>
          </Card>

          {overview.overviewCards.length > 0 ? (
            <Card title="Kernkennzahlen">
              <div className="pg-overview-card-grid">
                {overview.overviewCards.map((card) => (
                  <article key={card.label} className="pg-overview-card">
                    <span className="pg-workspace-subtitle">{card.label}</span>
                    <strong>{card.value}</strong>
                    <span>{card.hint}</span>
                  </article>
                ))}
              </div>
            </Card>
          ) : null}

          <div className="pg-company-overview-grid">
            <Card title="Finanzübersicht">
              {overview.financeSummary.length === 0 ? (
                <EmptyState title="Keine Finanzdaten vorhanden." />
              ) : (
                <ul className="pg-summary-list">
                  {overview.financeSummary.map((entry) => (
                    <li key={entry.label}>
                      <span>{entry.label}</span>
                      <strong>{entry.value}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Inventar">
              {overview.inventoryItems.length === 0 ? (
                <EmptyState title="Kein Inventar vorhanden." />
              ) : (
                <QueryRows
                  columns={['Ressource', 'Bestand', 'Verfügbar']}
                  rows={overview.inventoryItems.map((item, index) => ({
                    id: `${item.resourceLabel}-${index}`,
                    cells: [
                      item.resourceLabel,
                      String(item.quantity),
                      String(item.available),
                    ],
                  }))}
                />
              )}
            </Card>
          </div>

          <div className="pg-company-overview-grid">
            <Card title="Gebäude">
              <QueryRows
                columns={['Name', 'Typ', 'Region', 'Status']}
                selectedRowId={
                  viewData.session.hasGame ? undefined : null
                }
                onRowClick={(buildingId) => {
                  navigateToTarget(buildBuildingNavigationTarget(buildingId));
                  onOpenOperations();
                }}
                rows={overview.buildings.map((building) => ({
                  id: building.id,
                  cells: [
                    building.name,
                    building.buildingTypeLabel,
                    building.regionLabel,
                    building.statusLabel,
                  ],
                }))}
              />
            </Card>

            <Card title="Regionale Präsenz">
              {overview.regionalPresence.length === 0 ? (
                <EmptyState title="Keine Gebäude in Regionen platziert." />
              ) : (
                <QueryRows
                  columns={['Region', 'Gebäude', 'Standorte']}
                  onRowClick={(regionId) => {
                    navigateToTarget(buildRegionNavigationTarget(regionId));
                  }}
                  rows={overview.regionalPresence.map((presence) => ({
                    id: presence.regionId,
                    cells: [
                      presence.regionName,
                      String(presence.buildingCount),
                      presence.buildingSummary,
                    ],
                  }))}
                />
              )}
            </Card>
          </div>

          <div className="pg-company-overview-grid">
            <Card title="Aktivität">
              <ul className="pg-summary-list">
                <li>
                  <span>Produktionsjobs</span>
                  <strong>{overview.activeProductionCount}</strong>
                </li>
                <li>
                  <span>Forschungsjobs</span>
                  <strong>{overview.activeResearchCount}</strong>
                </li>
              </ul>
              {overview.recentEventHint !== null ? (
                <p className="pg-workspace-subtitle">{overview.recentEventHint}</p>
              ) : null}
            </Card>

            <Card title="Letzte Buchungen">
              {overview.recentTransactions.length === 0 ? (
                <EmptyState title="Noch keine Buchungen vorhanden." />
              ) : (
                <QueryRows
                  columns={['Typ', 'Betrag', 'Saldo']}
                  rows={overview.recentTransactions.map((transaction) => ({
                    id: transaction.id,
                    cells: [
                      transaction.typeLabel,
                      transaction.amountLabel,
                      transaction.balanceLabel,
                    ],
                  }))}
                />
              )}
            </Card>
          </div>
        </div>
      )}
    </ScreenQueryFrame>
  );
}
