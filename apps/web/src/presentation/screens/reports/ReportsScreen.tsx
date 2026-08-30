'use client';

import { useEffect, useMemo, useState } from 'react';
import { mapEventLogRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { fetchEventLog } from '@/presentation/adapters/api/query-client';
import type { EventLogRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import '../world/world-company.css';
import '../shared/operation-screen.css';

const EVENT_CATEGORY_FILTERS = Object.freeze([
  { value: '', label: 'Alle Kategorien' },
  { value: 'SESSION', label: 'Session' },
  { value: 'SIMULATION', label: 'Simulation' },
  { value: 'TRADE', label: 'Handel' },
  { value: 'BUILDING', label: 'Gebäude' },
  { value: 'PRODUCTION', label: 'Produktion' },
  { value: 'RESEARCH', label: 'Forschung' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'EMPLOYEE', label: 'Personal' },
]);

/** Reports dashboard with session summary, save metadata, and filtered event log. */
export function ReportsScreen() {
  const { viewData, navigation, selectEntity } = useGameWorkspace();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const eventQuery = useScreenQuery(
    `events:${categoryFilter}`,
    () =>
      fetchEventLog({
        limit: 100,
        ...(categoryFilter.length > 0 ? { category: categoryFilter } : {}),
      }).then(mapEventLogRowsViewData),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );
  const selectedEvent = useMemo(() => {
    if (selectedEventId === null) {
      return null;
    }

    return (eventQuery.data ?? []).find((entry) => entry.id === selectedEventId) ?? null;
  }, [eventQuery.data, selectedEventId]);

  useEffect(() => {
    if (navigation.entitySelection.kind === 'event') {
      setSelectedEventId(navigation.entitySelection.id);
    }
  }, [navigation.entitySelection]);

  return (
    <div className="pg-operation-screen">
      <Card title="Session">
        <ul className="pg-operation-detail-list">
          <li>
            <span>Unternehmen</span>
            <strong>{viewData.session.companyName ?? '—'}</strong>
          </li>
          <li>
            <span>Tick</span>
            <strong>{viewData.simulation.tickNumber ?? '—'}</strong>
          </li>
          <li>
            <span>Simulationszeit</span>
            <strong>{viewData.simulation.simulationTime ?? '—'}</strong>
          </li>
          <li>
            <span>Status</span>
            <strong>{viewData.simulation.isPaused ? 'Pausiert' : 'Aktiv'}</strong>
          </li>
        </ul>
      </Card>

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

      <ScreenQueryFrame
        hasGame={viewData.session.hasGame}
        isLoading={eventQuery.isLoading}
        errorMessage={eventQuery.errorMessage}
        loadingLabel="Ereignisprotokoll wird geladen…"
      >
        <Card title="Ereignisprotokoll">
          <div className="pg-operation-filter-row">
            <label htmlFor="event-category-filter">Kategorie</label>
            <select
              id="event-category-filter"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setSelectedEventId(null);
              }}
            >
              {EVENT_CATEGORY_FILTERS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <QueryRows
            columns={['Tick', 'Kategorie', 'Schwere', 'Ereignis']}
            rows={(eventQuery.data ?? []).map((row: EventLogRowViewData) => ({
              id: row.id,
              cells: [row.tickLabel, row.categoryLabel, row.severityLabel, row.message],
            }))}
            selectedRowId={selectedEventId}
            onRowClick={(eventId) => {
              setSelectedEventId(eventId);
              selectEntity({ kind: 'event', id: eventId });
            }}
          />
        </Card>

        {selectedEvent !== null ? (
          <Card title="Ereignisdetails">
            <ul className="pg-operation-detail-list">
              <li>
                <span>ID</span>
                <strong>{selectedEvent.id}</strong>
              </li>
              <li>
                <span>Tick</span>
                <strong>{selectedEvent.tickLabel}</strong>
              </li>
              <li>
                <span>Kategorie</span>
                <strong>{selectedEvent.categoryLabel}</strong>
              </li>
              <li>
                <span>Schweregrad</span>
                <strong>{selectedEvent.severityLabel}</strong>
              </li>
              <li>
                <span>Meldung</span>
                <strong>{selectedEvent.message}</strong>
              </li>
            </ul>
          </Card>
        ) : null}
      </ScreenQueryFrame>
    </div>
  );
}
