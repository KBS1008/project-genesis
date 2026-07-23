'use client';

import { useMemo } from 'react';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import {
  buildNameResolver,
  mapFinanceRowsViewData,
  mapMarketRowsViewData,
  mapProductionJobRowsViewData,
  mapResearchJobRowsViewData,
  mapTransportJobRowsViewData,
} from '@/presentation/adapters/mappers/workspace-view-mappers';
import { mapBuildingListRow } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import {
  fetchBuildingList,
  fetchFinanceTransactions,
  fetchMarketPrices,
  fetchProductionJobs,
  fetchResearchJobs,
  fetchTransportOrders,
} from '@/presentation/adapters/api/query-client';
import type { BuildingListRowViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { FinanceRowViewData, JobRowViewData, MarketRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';

/** Markets screen consuming dedicated market price queries. */
export function MarketsScreen() {
  const { viewData, companyViewData } = useGameWorkspace();
  const names = useMemo(() => buildNameResolver(companyViewData.labels), [companyViewData.labels]);
  const { data, isLoading, errorMessage } = useScreenQuery(
    'markets',
    () => fetchMarketPrices().then((prices) => mapMarketRowsViewData(prices, names.resource)),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Marktdaten werden geladen…"
    >
      <Card title="Märkte">
        <QueryRows
          columns={['Ressource', 'Preis', 'Trend', 'Druck']}
          rows={(data ?? []).map((row: MarketRowViewData) => ({
            id: row.resourceId,
            cells: [row.resourceLabel, row.lastPriceLabel, row.trendLabel, row.pressureLabel],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}

/** Production screen backed by production job queries. */
export function ProductionScreen() {
  const { viewData, companyViewData } = useGameWorkspace();
  const names = useMemo(() => buildNameResolver(companyViewData.labels), [companyViewData.labels]);
  const { data, isLoading, errorMessage } = useScreenQuery(
    'production',
    () => fetchProductionJobs().then((jobs) => mapProductionJobRowsViewData(jobs, names.recipe)),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Produktionsdaten werden geladen…"
    >
      <Card title="Produktion">
        <QueryRows
          columns={['Rezept', 'Status', 'Fortschritt']}
          rows={(data ?? []).map((row: JobRowViewData) => ({
            id: row.id,
            cells: [row.title, row.statusLabel, row.progressLabel],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}

/** Research screen backed by research job queries. */
export function ResearchScreen() {
  const { viewData, companyViewData } = useGameWorkspace();
  const names = useMemo(() => buildNameResolver(companyViewData.labels), [companyViewData.labels]);
  const { data, isLoading, errorMessage } = useScreenQuery(
    'research',
    () => fetchResearchJobs().then((jobs) => mapResearchJobRowsViewData(jobs, names.technology)),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Forschungsdaten werden geladen…"
    >
      <Card title="Forschung">
        <QueryRows
          columns={['Technologie', 'Status', 'Fortschritt']}
          rows={(data ?? []).map((row: JobRowViewData) => ({
            id: row.id,
            cells: [row.title, row.statusLabel, row.progressLabel],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}

/** Transport screen backed by transport order queries. */
export function TransportScreen() {
  const { viewData } = useGameWorkspace();
  const { data, isLoading, errorMessage } = useScreenQuery(
    'transport',
    () => fetchTransportOrders().then(mapTransportJobRowsViewData),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Transportdaten werden geladen…"
    >
      <Card title="Transport">
        <QueryRows
          columns={['Route', 'Status', 'Fortschritt']}
          rows={(data ?? []).map((row: JobRowViewData) => ({
            id: row.id,
            cells: [row.title, row.statusLabel, row.progressLabel],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}

/** Finance screen backed by finance transaction queries. */
export function FinanceScreen() {
  const { viewData } = useGameWorkspace();
  const { data, isLoading, errorMessage } = useScreenQuery(
    'finance',
    () => fetchFinanceTransactions().then(mapFinanceRowsViewData),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Finanzdaten werden geladen…"
    >
      <Card title="Finanzen">
        <QueryRows
          columns={['Typ', 'Betrag', 'Saldo']}
          rows={(data ?? []).map((row: FinanceRowViewData) => ({
            id: row.id,
            cells: [row.typeLabel, row.amountLabel, row.balanceLabel],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}

/** Reports screen combining save metadata and event log queries. */
export function ReportsScreen() {
  const { viewData } = useGameWorkspace();

  return (
    <div className="pg-screen-placeholder">
      <Card title="Spielstände">
        {viewData.saves.length === 0 ? (
          <EmptyState title="Keine Spielstände gefunden." />
        ) : (
          <QueryRows
            columns={['Datei', 'Unternehmen', 'Tick', 'Schema']}
            rows={viewData.saves.map((save) => ({
              id: save.filePath,
              cells: [save.fileName, save.companyName, save.tickLabel, save.schemaVersionLabel],
            }))}
          />
        )}
      </Card>
    </div>
  );
}

/** Buildings screen backed by the dedicated buildings query endpoint. */
export function BuildingsScreen() {
  const { companyViewData, viewData, regions } = useGameWorkspace();
  const regionNames = useMemo(
    () => new Map(regions.map((region) => [region.id, region.name])),
    [regions],
  );
  const { data, isLoading, errorMessage } = useScreenQuery(
    'buildings',
    () =>
      fetchBuildingList().then((buildings) =>
        buildings.map((building) => mapBuildingListRow(building, companyViewData.labels, regionNames)),
      ),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Gebäudedaten werden geladen…"
    >
      <Card title="Gebäude">
        <QueryRows
          columns={['Name', 'Typ', 'Region', 'Status', 'Position']}
          rows={(data ?? []).map((building: BuildingListRowViewData) => ({
            id: building.id,
            cells: [
              building.name,
              building.buildingTypeLabel,
              building.regionLabel,
              building.statusLabel,
              building.positionLabel,
            ],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}
