'use client';

import { useEffect, useMemo, useState } from 'react';
import { mapTransportJobRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { fetchTransportOrders } from '@/presentation/adapters/api/query-client';
import type { JobRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import '../world/world-company.css';
import '../shared/operation-screen.css';

/** Transport screen with logistics summary, active orders, route inspection, and detail. */
export function TransportScreen() {
  const { viewData, companyViewData, navigation, isBusy, selectEntity } = useGameWorkspace();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const tickKey = viewData.simulation.tickNumber ?? 0;
  const ordersQuery = useScreenQuery(
    `transport:${tickKey}`,
    () => fetchTransportOrders().then(mapTransportJobRowsViewData),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );
  const selectedDetail =
    selectedOrderId === null
      ? null
      : (companyViewData.detail.transportOrders.get(selectedOrderId) ?? null);
  const routeSummary = useMemo(() => {
    const rows = ordersQuery.data ?? [];

    return Object.freeze({
      active: rows.filter((row) => row.statusLabel === 'IN_PROGRESS').length,
      waiting: rows.filter((row) => row.statusLabel === 'WAITING').length,
      completed: rows.filter((row) => row.statusLabel === 'COMPLETED').length,
    });
  }, [ordersQuery.data]);

  useEffect(() => {
    if (navigation.entitySelection.kind === 'transport') {
      setSelectedOrderId(navigation.entitySelection.id);
    }
  }, [navigation.entitySelection]);

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={ordersQuery.isLoading}
      errorMessage={ordersQuery.errorMessage}
      loadingLabel="Transportdaten werden geladen…"
    >
      <div className="pg-operation-screen">
        {companyViewData.logisticsStatusMessage !== null ? (
          <StatusBanner tone="info" message={companyViewData.logisticsStatusMessage} />
        ) : null}

        <div className="pg-operation-summary-grid">
          <Card title="Aktiv unterwegs">
            <p className="pg-operation-metric">{companyViewData.kpis.activeTransportCount}</p>
            <p className="pg-operation-hint-copy">{companyViewData.kpis.activeTransportTrend}</p>
          </Card>
          <Card title="Warteschlange">
            <p className="pg-operation-metric">{routeSummary.waiting}</p>
            <p className="pg-operation-hint-copy">Auf freie Netzkapazität</p>
          </Card>
          <Card title="Abgeschlossen">
            <p className="pg-operation-metric">{routeSummary.completed}</p>
            <p className="pg-operation-hint-copy">In dieser Session sichtbar</p>
          </Card>
        </div>

        <Card title="Transportaufträge">
          <QueryRows
            columns={['Route', 'Status', 'Fortschritt']}
            rows={(ordersQuery.data ?? []).map((row: JobRowViewData) => ({
              id: row.id,
              cells: [row.title, row.statusLabel, row.progressLabel],
            }))}
            selectedRowId={selectedOrderId}
            onRowClick={(orderId) => {
              setSelectedOrderId(orderId);
              selectEntity({ kind: 'transport', id: orderId });
            }}
          />
        </Card>

        {selectedDetail !== null ? (
          <Card title={selectedDetail.title}>
            <p className="pg-operation-hint-copy">
              <strong>{selectedDetail.subtitle}</strong>
            </p>
            <ul className="pg-operation-detail-list">
              {selectedDetail.entries.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="Kein Transport ausgewählt"
            hint="Wählen Sie einen Auftrag aus, um Route und Verbindung zu prüfen."
          />
        )}

        {isBusy ? (
          <StatusBanner tone="info" message="Transportdaten werden nach einer Aktion aktualisiert…" />
        ) : null}
      </div>
    </ScreenQueryFrame>
  );
}
