'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  callApi,
  fetchDashboard,
  type BuildingReadModel,
  type GameSessionDashboard,
} from '@/lib/api';

type StatusTone = '' | 'success' | 'error';

type TableColumn<T extends string> = {
  readonly key: T;
  readonly label: string;
};

function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

function findActiveSawmill(buildings: readonly BuildingReadModel[]) {
  return buildings.find(
    (building) => building.buildingTypeId === 'sawmill' && building.status === 'ACTIVE',
  );
}

function KeyValuePanel({
  entries,
}: {
  readonly entries: readonly (readonly [string, string])[];
}) {
  return (
    <dl className="kv">
      {entries.map(([label, value]) => (
        <div key={label} style={{ display: 'contents' }}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ConstructionStatus({ building }: { readonly building: BuildingReadModel }) {
  if (building.status !== 'UNDER_CONSTRUCTION') {
    return <>{building.status}</>;
  }

  return (
    <div className="progress-cell">
      <span>{building.status}</span>
      <div className="progress-bar" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${Math.round(building.constructionProgress)}%` }}
        />
      </div>
      <span className="progress-label">{formatProgress(building.constructionProgress)}</span>
    </div>
  );
}

function DataTable<T extends string>({
  columns,
  rows,
  emptyText,
  renderCell,
}: {
  readonly columns: readonly TableColumn<T>[];
  readonly rows: ReadonlyArray<Partial<Record<T, string | number>>>;
  readonly emptyText: string;
  readonly renderCell?: (key: T, row: Partial<Record<T, string | number>>) => ReactNode;
}) {
  if (rows.length === 0) {
    return <p className="empty">{emptyText}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.key}>
                {renderCell?.(column.key, row) ?? row[column.key] ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Interactive browser dashboard wired to the NestJS API. */
export function DashboardShell() {
  const [dashboard, setDashboard] = useState<GameSessionDashboard | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<StatusTone>('');

  const refreshDashboard = useCallback(async () => {
    const nextDashboard = await fetchDashboard();
    setDashboard(nextDashboard);
  }, []);

  useEffect(() => {
    void refreshDashboard().catch((error: unknown) => {
      setStatusMessage(
        error instanceof Error ? error.message : 'Dashboard konnte nicht geladen werden.',
      );
      setStatusTone('error');
    });
  }, [refreshDashboard]);

  const runAction = useCallback(
    async (action: () => Promise<void>, successMessage: string) => {
      try {
        setStatusMessage('Working…');
        setStatusTone('');
        await action();
        await refreshDashboard();
        setStatusMessage(successMessage);
        setStatusTone('success');
      } catch (error: unknown) {
        setStatusMessage(error instanceof Error ? error.message : 'Unexpected error.');
        setStatusTone('error');
      }
    },
    [refreshDashboard],
  );

  const requireActiveSawmill = useCallback(() => {
    const sawmill = findActiveSawmill(dashboard?.buildings ?? []);

    if (sawmill === undefined) {
      throw new Error('Kein aktives Sägewerk verfügbar. Bau abschließen und Ticks ausführen.');
    }

    return sawmill.id;
  }, [dashboard?.buildings]);

  const hasGame = Boolean(dashboard?.company);
  const actions = dashboard?.availableActions;

  return (
    <div className="layout">
      <header className="header">
        <div>
          <p className="eyebrow">Deterministic Economy Simulation</p>
          <h1>Project Genesis</h1>
        </div>
        <div className="header-meta">
          <span>{dashboard ? `Tick ${dashboard.tickNumber}` : 'Tick —'}</span>
          <span>{dashboard ? `Time ${dashboard.simulationTime}` : 'Time —'}</span>
        </div>
      </header>

      <section className="toolbar card">
        <div className="toolbar-group">
          <span className="toolbar-label">Session</span>
          <button
            type="button"
            onClick={() => {
              void runAction(
                () =>
                  callApi('/api/session/new', {
                    method: 'POST',
                    body: JSON.stringify({ name: 'Genesis Industries' }),
                  }),
                'Neues Spiel gestartet.',
              );
            }}
          >
            Neues Spiel
          </button>
          <button
            type="button"
            disabled={!hasGame}
            onClick={() => {
              void runAction(
                () => callApi('/api/session/save', { method: 'POST', body: '{}' }),
                'Spielstand gespeichert.',
              );
            }}
          >
            Speichern
          </button>
          <button
            type="button"
            disabled={!hasGame}
            onClick={() => {
              void runAction(
                () => callApi('/api/session/load', { method: 'POST', body: '{}' }),
                'Spielstand geladen.',
              );
            }}
          >
            Laden
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Simulation</span>
          <button
            type="button"
            disabled={!hasGame}
            onClick={() => {
              void runAction(
                () => callApi('/api/simulation/tick', { method: 'POST', body: '{}' }),
                'Simulation tick ausgeführt.',
              );
            }}
          >
            Simulation Tick
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Bauen</span>
          <button
            type="button"
            disabled={!hasGame}
            onClick={() => {
              void runAction(
                () =>
                  callApi('/api/buildings/place', {
                    method: 'POST',
                    body: JSON.stringify({
                      buildingTypeId: 'sawmill',
                      name: 'Starter Sawmill',
                      x: 0,
                      y: 0,
                    }),
                  }),
                'Sägewerk in Bau gegeben.',
              );
            }}
          >
            Sägewerk bauen
          </button>
          <button
            type="button"
            disabled={!hasGame || !actions?.canPlaceWarehouse}
            onClick={() => {
              void runAction(
                () =>
                  callApi('/api/buildings/place', {
                    method: 'POST',
                    body: JSON.stringify({
                      buildingTypeId: 'warehouse',
                      name: 'Main Warehouse',
                      x: 2,
                      y: 0,
                    }),
                  }),
                'Lager in Bau gegeben.',
              );
            }}
          >
            Lager bauen
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Produktion</span>
          <button
            type="button"
            disabled={!hasGame || !actions?.canStartPlanksProduction}
            onClick={() => {
              void runAction(async () => {
                const buildingId = requireActiveSawmill();
                await callApi('/api/production/start', {
                  method: 'POST',
                  body: JSON.stringify({ buildingId, recipeId: 'recipe_planks' }),
                });
              }, 'Bretter-Produktion gestartet.');
            }}
          >
            Bretter produzieren
          </button>
          <button
            type="button"
            disabled={!hasGame || !actions?.canStartAdvancedPlanksProduction}
            onClick={() => {
              void runAction(async () => {
                const buildingId = requireActiveSawmill();
                await callApi('/api/production/start', {
                  method: 'POST',
                  body: JSON.stringify({ buildingId, recipeId: 'recipe_advanced_planks' }),
                });
              }, 'Premium-Bretter-Produktion gestartet.');
            }}
          >
            Premium-Bretter
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Markt</span>
          <button
            type="button"
            disabled={!hasGame}
            onClick={() => {
              void runAction(
                () =>
                  callApi('/api/market/sell', {
                    method: 'POST',
                    body: JSON.stringify({ resourceId: 'wood', amount: 5 }),
                  }),
                'Holz verkauft.',
              );
            }}
          >
            5× Holz verkaufen
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Forschung</span>
          <button
            type="button"
            disabled={!hasGame || !actions?.canStartWoodworkingResearch}
            onClick={() => {
              void runAction(
                () =>
                  callApi('/api/research/start', {
                    method: 'POST',
                    body: JSON.stringify({ technologyId: 'basic_woodworking' }),
                  }),
                'Forschung „Holzbearbeitung“ gestartet.',
              );
            }}
          >
            Holzbearbeitung
          </button>
        </div>

        <p className={`status-message ${statusTone}`.trim()} aria-live="polite">
          {statusMessage}
        </p>
      </section>

      <main className="grid">
        <section className="card">
          <h2>Firma</h2>
          {!dashboard?.company ? (
            <KeyValuePanel entries={[['Status', 'Kein aktives Spiel']]} />
          ) : (
            <KeyValuePanel
              entries={[
                ['Name', dashboard.company.name],
                ['ID', dashboard.company.id],
                ['Owner', dashboard.company.ownerId],
                ['Status', dashboard.company.status],
              ]}
            />
          )}
        </section>

        <section className="card">
          <h2>Finanzen</h2>
          {!dashboard?.finance ? (
            <KeyValuePanel entries={[['Status', '—']]} />
          ) : (
            <KeyValuePanel
              entries={[
                ['Cash', `${dashboard.finance.cashBalance.toLocaleString('de-DE')} GC`],
                ['Reserved', `${dashboard.finance.reservedCash.toLocaleString('de-DE')} GC`],
                ['Available', `${dashboard.finance.availableCash.toLocaleString('de-DE')} GC`],
              ]}
            />
          )}
        </section>

        <section className="card">
          <h2>Inventar</h2>
          <div className="table-wrap">
            {!dashboard?.inventory ? (
              <p className="empty">Inventar erscheint nach Spielstart.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'resourceId', label: 'Resource' },
                  { key: 'quantity', label: 'Qty' },
                  { key: 'reserved', label: 'Reserved' },
                  { key: 'available', label: 'Available' },
                ]}
                rows={dashboard.inventory.items}
                emptyText="Inventar ist leer."
              />
            )}
          </div>
        </section>

        <section className="card span-2">
          <h2>Gebäude</h2>
          <div className="table-wrap">
            {!dashboard?.company ? (
              <p className="empty">Noch keine Gebäude.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'buildingTypeId', label: 'Type' },
                  { key: 'status', label: 'Status' },
                  { key: 'position', label: 'Pos' },
                ]}
                rows={dashboard.buildings.map((building) => ({
                  name: building.name,
                  buildingTypeId: building.buildingTypeId,
                  status: building.status,
                  position: `${building.x}, ${building.y}`,
                }))}
                emptyText="Noch keine Gebäude."
                renderCell={(key, row) => {
                  if (key !== 'status') {
                    return row[key];
                  }

                  const building = dashboard.buildings.find(
                    (entry) => entry.name === row.name && entry.buildingTypeId === row.buildingTypeId,
                  );

                  return building ? <ConstructionStatus building={building} /> : row.status;
                }}
              />
            )}
          </div>
        </section>

        <section className="card">
          <h2>Produktion</h2>
          <div className="table-wrap">
            {!dashboard?.company ? (
              <p className="empty">Keine laufende Produktion.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'recipeId', label: 'Recipe' },
                  { key: 'buildingId', label: 'Building' },
                  { key: 'status', label: 'Status' },
                  { key: 'progress', label: 'Progress' },
                ]}
                rows={dashboard.productionJobs.map((job) => ({
                  recipeId: job.recipeId,
                  buildingId: job.buildingId,
                  status: job.status,
                  progress: formatProgress(job.progress),
                }))}
                emptyText="Keine laufende Produktion."
              />
            )}
          </div>
        </section>

        <section className="card">
          <h2>Forschung</h2>
          <div className="table-wrap">
            {!dashboard?.company ? (
              <p className="empty">Keine laufende Forschung.</p>
            ) : dashboard.researchJobs.length === 0 ? (
              <p className="empty">
                {dashboard.completedResearch.length > 0
                  ? `Abgeschlossen: ${dashboard.completedResearch.join(', ')}`
                  : 'Keine laufende Forschung.'}
              </p>
            ) : (
              <DataTable
                columns={[
                  { key: 'technologyId', label: 'Technology' },
                  { key: 'status', label: 'Status' },
                  { key: 'progress', label: 'Progress' },
                ]}
                rows={dashboard.researchJobs.map((job) => ({
                  technologyId: job.technologyId,
                  status: job.status,
                  progress: formatProgress(job.progress),
                }))}
                emptyText="Keine laufende Forschung."
              />
            )}
          </div>
        </section>

        <section className="card">
          <h2>Marktpreise</h2>
          <div className="table-wrap">
            <DataTable
              columns={[
                { key: 'resourceId', label: 'Resource' },
                { key: 'lastPrice', label: 'Price' },
                { key: 'tradeVolume', label: 'Volume' },
              ]}
              rows={dashboard?.marketPrices ?? []}
              emptyText="Keine Marktpreise geladen."
            />
          </div>
        </section>

        <section className="card span-2">
          <h2>Meilensteine</h2>
          <ul className="milestone-list">
            {(dashboard?.milestones ?? []).length === 0 ? (
              <li className="empty milestone-empty">Noch keine Meilensteine geladen.</li>
            ) : (
              dashboard?.milestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className={milestone.completed ? 'milestone-done' : 'milestone-pending'}
                >
                  <span className="milestone-name">{milestone.name}</span>
                  <span className="milestone-id">{milestone.id}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
