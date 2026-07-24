'use client';

import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { mapFinanceRowsViewData, mapTransportJobRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { fetchFinanceTransactions, fetchTransportOrders } from '@/presentation/adapters/api/query-client';
import type { FinanceRowViewData, JobRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';

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
