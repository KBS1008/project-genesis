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
import type { JobRowViewData, MarketRowViewData, FinanceRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useEffect, useState } from 'react';

function QueryRows({
  rows,
  columns,
}: {
  readonly rows: readonly { readonly id: string; readonly cells: readonly string[] }[];
  readonly columns: readonly string[];
}) {
  if (rows.length === 0) {
    return <EmptyState title="Keine Daten vorhanden." />;
  }

  return (
    <div className="pg-query-table" role="table" aria-label="Abfrageergebnisse">
      <div className="pg-query-row pg-query-header" role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.id} className="pg-query-row" role="row">
          {row.cells.map((cell, index) => (
            <span key={`${row.id}-${index}`} role="cell">
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function useScreenQuery<T>(queryKey: string, loader: () => Promise<T>, enabled: boolean): {
  readonly data: T | null;
  readonly isLoading: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    void loader()
      .then((result) => {
        if (active) {
          setData(result);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [queryKey, enabled]);

  return { data, isLoading };
}

/** Markets screen consuming dedicated market price queries. */
export function MarketsScreen() {
  const { viewData, companyViewData } = useGameWorkspace();
  const names = useMemo(() => buildNameResolver(companyViewData.labels), [companyViewData.labels]);
  const { data, isLoading } = useScreenQuery(
    'markets',
    () => fetchMarketPrices().then((prices) => mapMarketRowsViewData(prices, names.resource)),
    viewData.session.hasGame,
  );

  if (!viewData.session.hasGame) {
    return <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel im Unternehmen-Screen." />;
  }

  if (isLoading || data === null) {
    return <EmptyState title="Marktdaten werden geladen…" />;
  }

  return (
    <Card title="Märkte">
      <QueryRows
        columns={['Ressource', 'Preis', 'Trend', 'Druck']}
        rows={data.map((row: MarketRowViewData) => ({
          id: row.resourceId,
          cells: [row.resourceLabel, row.lastPriceLabel, row.trendLabel, row.pressureLabel],
        }))}
      />
    </Card>
  );
}

/** Production screen backed by production job queries. */
export function ProductionScreen() {
  const { viewData, companyViewData } = useGameWorkspace();
  const names = useMemo(() => buildNameResolver(companyViewData.labels), [companyViewData.labels]);
  const { data, isLoading } = useScreenQuery(
    'production',
    () => fetchProductionJobs().then((jobs) => mapProductionJobRowsViewData(jobs, names.recipe)),
    viewData.session.hasGame,
  );

  if (!viewData.session.hasGame) {
    return <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel im Unternehmen-Screen." />;
  }

  if (isLoading || data === null) {
    return <EmptyState title="Produktionsdaten werden geladen…" />;
  }

  return (
    <Card title="Produktion">
      <QueryRows
        columns={['Rezept', 'Status', 'Fortschritt']}
        rows={data.map((row: JobRowViewData) => ({
          id: row.id,
          cells: [row.title, row.statusLabel, row.progressLabel],
        }))}
      />
    </Card>
  );
}

/** Research screen backed by research job queries. */
export function ResearchScreen() {
  const { viewData, companyViewData } = useGameWorkspace();
  const names = useMemo(() => buildNameResolver(companyViewData.labels), [companyViewData.labels]);
  const { data, isLoading } = useScreenQuery(
    'research',
    () => fetchResearchJobs().then((jobs) => mapResearchJobRowsViewData(jobs, names.technology)),
    viewData.session.hasGame,
  );

  if (!viewData.session.hasGame) {
    return <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel im Unternehmen-Screen." />;
  }

  if (isLoading || data === null) {
    return <EmptyState title="Forschungsdaten werden geladen…" />;
  }

  return (
    <Card title="Forschung">
      <QueryRows
        columns={['Technologie', 'Status', 'Fortschritt']}
        rows={data.map((row: JobRowViewData) => ({
          id: row.id,
          cells: [row.title, row.statusLabel, row.progressLabel],
        }))}
      />
    </Card>
  );
}

/** Transport screen backed by transport order queries. */
export function TransportScreen() {
  const { viewData } = useGameWorkspace();
  const { data, isLoading } = useScreenQuery(
    'transport',
    () => fetchTransportOrders().then(mapTransportJobRowsViewData),
    viewData.session.hasGame,
  );

  if (!viewData.session.hasGame) {
    return <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel im Unternehmen-Screen." />;
  }

  if (isLoading || data === null) {
    return <EmptyState title="Transportdaten werden geladen…" />;
  }

  return (
    <Card title="Transport">
      <QueryRows
        columns={['Route', 'Status', 'Fortschritt']}
        rows={data.map((row: JobRowViewData) => ({
          id: row.id,
          cells: [row.title, row.statusLabel, row.progressLabel],
        }))}
      />
    </Card>
  );
}

/** Finance screen backed by finance transaction queries. */
export function FinanceScreen() {
  const { viewData } = useGameWorkspace();
  const { data, isLoading } = useScreenQuery(
    'finance',
    () => fetchFinanceTransactions().then(mapFinanceRowsViewData),
    viewData.session.hasGame,
  );

  if (!viewData.session.hasGame) {
    return <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel im Unternehmen-Screen." />;
  }

  if (isLoading || data === null) {
    return <EmptyState title="Finanzdaten werden geladen…" />;
  }

  return (
    <Card title="Finanzen">
      <QueryRows
        columns={['Typ', 'Betrag', 'Saldo']}
        rows={data.map((row: FinanceRowViewData) => ({
          id: row.id,
          cells: [row.typeLabel, row.amountLabel, row.balanceLabel],
        }))}
      />
    </Card>
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
  const { companyViewData, viewData } = useGameWorkspace();
  const { data, isLoading } = useScreenQuery(
    'buildings',
    () =>
      fetchBuildingList().then((buildings) =>
        buildings.map((building) => mapBuildingListRow(building, companyViewData.labels)),
      ),
    viewData.session.hasGame,
  );

  if (!viewData.session.hasGame) {
    return <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel im Unternehmen-Screen." />;
  }

  if (isLoading || data === null) {
    return <EmptyState title="Gebäudedaten werden geladen…" />;
  }

  return (
    <Card title="Gebäude">
      <QueryRows
        columns={['Name', 'Typ', 'Status', 'Position']}
        rows={data.map((building: BuildingListRowViewData) => ({
          id: building.id,
          cells: [
            building.name,
            building.buildingTypeLabel,
            building.statusLabel,
            building.positionLabel,
          ],
        }))}
      />
    </Card>
  );
}
