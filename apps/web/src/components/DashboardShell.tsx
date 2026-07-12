'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  buildNameMap,
  callApi,
  fetchDashboard,
  type BuildingReadModel,
  type GameSessionDashboard,
} from '@/lib/api';

type StatusTone = '' | 'success' | 'error' | 'info';

type KeyValueEntry = readonly [label: string, value: string, valueClass?: string];

type TableColumn<T extends string> = {
  readonly key: T;
  readonly label: string;
};

function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

function formatEnergy(value: number): string {
  return `${value.toFixed(1)} MW`;
}

function formatProductionStatus(status: string, awaitingTransport: boolean): string {
  if (status === 'WAITING' && awaitingTransport) {
    return 'Wartet auf Transport';
  }

  return status;
}

function KpiStrip({
  kpis,
}: {
  readonly kpis: GameSessionDashboard['kpis'];
}) {
  if (kpis === null) {
    return null;
  }

  return (
    <section className="kpi-strip" aria-label="Kennzahlen">
      <article className="kpi-card">
        <span className="kpi-label">Verfügbar</span>
        <strong className="kpi-value">{kpis.availableCash.toLocaleString('de-DE')} GC</strong>
      </article>
      <article className={`kpi-card${kpis.energyHasDeficit ? ' kpi-warning' : ''}`}>
        <span className="kpi-label">Energie-Reserve</span>
        <strong className="kpi-value">{formatEnergy(kpis.energyReserve)}</strong>
      </article>
      <article className={`kpi-card${kpis.activeTransportCount > 0 ? ' kpi-active' : ''}`}>
        <span className="kpi-label">Transporte</span>
        <strong className="kpi-value">{kpis.activeTransportCount}</strong>
      </article>
      <article className="kpi-card">
        <span className="kpi-label">Im Lagerhaus</span>
        <strong className="kpi-value">{kpis.warehouseTotalUnits}</strong>
      </article>
      <article className="kpi-card">
        <span className="kpi-label">Am Standort</span>
        <strong className="kpi-value">{kpis.onSiteResourceLines} Ressourcen</strong>
      </article>
    </section>
  );
}

function LogisticsBanner({
  message,
}: {
  readonly message: string | null;
}) {
  if (message === null || message.length === 0) {
    return null;
  }

  return (
    <p className="logistics-banner" role="status">
      {message}
    </p>
  );
}

function HintButton({
  label,
  disabled,
  reason,
  variant = 'primary',
  onClick,
}: {
  readonly label: string;
  readonly disabled: boolean;
  readonly reason: string | null;
  readonly variant?: 'primary' | 'secondary';
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={variant === 'secondary' ? 'btn-secondary' : undefined}
      disabled={disabled}
      title={reason ?? undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Toast({
  message,
  tone,
}: {
  readonly message: string;
  readonly tone: StatusTone;
}) {
  if (message.length === 0) {
    return null;
  }

  const icon = tone === 'success' ? '✓' : tone === 'error' ? '!' : tone === 'info' ? '…' : '•';

  return (
    <p className={`toast ${tone}`.trim()} role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{message}</span>
    </p>
  );
}

function KeyValuePanel({
  entries,
}: {
  readonly entries: readonly KeyValueEntry[];
}) {
  return (
    <dl className="kv">
      {entries.map(([label, value, valueClass]) => (
        <div key={label} style={{ display: 'contents' }}>
          <dt>{label}</dt>
          <dd className={valueClass}>{value}</dd>
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

const THEME_STORAGE_KEY = 'pg-theme';
type ThemeMode = 'light' | 'dark';

function applyTheme(theme: ThemeMode): void {
  document.documentElement.dataset.theme = theme;
}

/** Interactive browser dashboard wired to the NestJS API. */
export function DashboardShell() {
  const [dashboard, setDashboard] = useState<GameSessionDashboard | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<StatusTone>('');

  const nameMaps = useMemo(() => {
    if (dashboard === null) {
      return {
        resources: new Map<string, string>(),
        buildings: new Map<string, string>(),
        recipes: new Map<string, string>(),
        technologies: new Map<string, string>(),
      };
    }

    return {
      resources: buildNameMap(dashboard.contentNames.resources),
      buildings: buildNameMap(dashboard.contentNames.buildings),
      recipes: buildNameMap(dashboard.contentNames.recipes),
      technologies: buildNameMap(dashboard.contentNames.technologies),
    };
  }, [dashboard]);

  const refreshDashboard = useCallback(async () => {
    const nextDashboard = await fetchDashboard();
    setDashboard(nextDashboard);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      applyTheme(storedTheme);
      return;
    }

    applyTheme('light');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const nextTheme: ThemeMode = current === 'light' ? 'dark' : 'light';
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    void refreshDashboard()
      .catch((error: unknown) => {
        setStatusMessage(
          error instanceof Error ? error.message : 'Dashboard konnte nicht geladen werden.',
        );
        setStatusTone('error');
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, [refreshDashboard]);

  const runAction = useCallback(
    async (action: () => Promise<void>, successMessage: string) => {
      try {
        setIsBusy(true);
        setStatusMessage('Bitte warten…');
        setStatusTone('info');
        await action();
        await refreshDashboard();
        setStatusMessage(successMessage);
        setStatusTone('success');
      } catch (error: unknown) {
        setStatusMessage(error instanceof Error ? error.message : 'Unerwarteter Fehler.');
        setStatusTone('error');
      } finally {
        setIsBusy(false);
      }
    },
    [refreshDashboard],
  );

  const hasGame = Boolean(dashboard?.company);
  const hints = dashboard?.hints;
  const buildingCount = dashboard?.buildings.length ?? 0;

  const labelResource = (resourceId: string) =>
    nameMaps.resources.get(resourceId) ?? resourceId;
  const labelBuilding = (buildingTypeId: string) =>
    nameMaps.buildings.get(buildingTypeId) ?? buildingTypeId;
  const labelRecipe = (recipeId: string) => nameMaps.recipes.get(recipeId) ?? recipeId;
  const labelTechnology = (technologyId: string) =>
    nameMaps.technologies.get(technologyId) ?? technologyId;

  return (
    <div className={`layout${isBusy ? ' is-busy' : ''}`}>
      {isBusy ? (
        <div className="loading-overlay" aria-hidden="true">
          <div className="loading-panel">
            <span className="spinner" />
            <span>Aktion wird ausgeführt…</span>
          </div>
        </div>
      ) : null}

      <header className="header">
        <div>
          <p className="eyebrow">Deterministic Economy Simulation</p>
          <h1>Project Genesis</h1>
        </div>
        <div className="header-meta">
          <button
            type="button"
            className="btn-secondary theme-toggle"
            aria-label={theme === 'light' ? 'Dark Mode aktivieren' : 'Light Mode aktivieren'}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <span className="meta-pill">Tick {dashboard?.tickNumber ?? '—'}</span>
          <span className="meta-pill">Zeit {dashboard?.simulationTime ?? '—'}</span>
          {dashboard?.energy?.hasDeficit ? (
            <span className="meta-pill" style={{ color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.45)' }}>
              Energie-Defizit
            </span>
          ) : null}
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
            className="btn-secondary"
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
            className="btn-secondary"
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
          <button
            type="button"
            disabled={!hasGame}
            onClick={() => {
              void runAction(
                () =>
                  callApi('/api/simulation/tick', {
                    method: 'POST',
                    body: JSON.stringify({ count: 10 }),
                  }),
                '10 Simulation ticks ausgeführt.',
              );
            }}
          >
            10× Tick
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Bauen</span>
          {(hints?.placeBuilding ?? []).map((hint) => (
            <HintButton
              key={hint.buildingTypeId}
              label={hint.name}
              disabled={!hasGame || !hint.canPlace}
              reason={hint.reason}
              onClick={() => {
                void runAction(
                  () =>
                    callApi('/api/buildings/place', {
                      method: 'POST',
                      body: JSON.stringify({
                        buildingTypeId: hint.buildingTypeId,
                        name: hint.name,
                        x: buildingCount * 2,
                        y: 0,
                      }),
                    }),
                  `${hint.name} in Bau gegeben.`,
                );
              }}
            />
          ))}
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Produktion</span>
          {(hints?.production ?? []).map((hint) => (
            <HintButton
              key={`${hint.buildingId}-${hint.recipeId}`}
              label={`${hint.recipeName} (${hint.buildingName})`}
              disabled={!hasGame || !hint.canStart}
              reason={hint.reason}
              onClick={() => {
                void runAction(
                  () =>
                    callApi('/api/production/start', {
                      method: 'POST',
                      body: JSON.stringify({
                        buildingId: hint.buildingId,
                        recipeId: hint.recipeId,
                      }),
                    }),
                  `${hint.recipeName} gestartet.`,
                );
              }}
            />
          ))}
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Markt</span>
          {(hints?.market ?? []).flatMap((hint) => [
            <HintButton
              key={`sell-${hint.resourceId}`}
              label={`${hint.tradeAmount}× ${hint.name} verkaufen`}
              variant="secondary"
              disabled={!hasGame || !hint.canSell}
              reason={hint.sellReason}
              onClick={() => {
                void runAction(
                  () =>
                    callApi('/api/market/sell', {
                      method: 'POST',
                      body: JSON.stringify({
                        resourceId: hint.resourceId,
                        amount: hint.tradeAmount,
                      }),
                    }),
                  `${hint.name} verkauft.`,
                );
              }}
            />,
            <HintButton
              key={`buy-${hint.resourceId}`}
              label={`${hint.tradeAmount}× ${hint.name} kaufen`}
              disabled={!hasGame || !hint.canBuy}
              reason={hint.buyReason}
              onClick={() => {
                void runAction(
                  () =>
                    callApi('/api/market/buy', {
                      method: 'POST',
                      body: JSON.stringify({
                        resourceId: hint.resourceId,
                        amount: hint.tradeAmount,
                      }),
                    }),
                  `${hint.name} gekauft.`,
                );
              }}
            />,
          ])}
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Forschung</span>
          {(hints?.research ?? []).map((hint) => (
            <HintButton
              key={hint.technologyId}
              label={hint.name}
              disabled={!hasGame || !hint.canStart}
              reason={hint.reason}
              onClick={() => {
                void runAction(
                  () =>
                    callApi('/api/research/start', {
                      method: 'POST',
                      body: JSON.stringify({ technologyId: hint.technologyId }),
                    }),
                  `Forschung „${hint.name}“ gestartet.`,
                );
              }}
            />
          ))}
        </div>

        <Toast message={statusMessage} tone={statusTone} />
      </section>

      {hasGame && dashboard?.kpis ? <KpiStrip kpis={dashboard.kpis} /> : null}
      <LogisticsBanner message={dashboard?.logistics?.statusMessage ?? null} />

      <main className="grid">
        {isInitialLoading ? (
          <>
            <section className="card card-loading span-2">
              <div className="skeleton-block" style={{ width: '40%' }} />
              <div className="skeleton-block" style={{ width: '70%', marginTop: '0.75rem' }} />
            </section>
            <section className="card card-loading">
              <div className="skeleton-block" style={{ width: '55%' }} />
            </section>
            <section className="card card-loading">
              <div className="skeleton-block" style={{ width: '60%' }} />
            </section>
          </>
        ) : (
          <>
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

        <section className={`card${dashboard?.energy?.hasDeficit ? ' card-warning' : ''}`}>
          <h2>Energie</h2>
          {!dashboard?.energy ? (
            <KeyValuePanel entries={[['Status', '—']]} />
          ) : (
            <KeyValuePanel
              entries={[
                ['Erzeugung', formatEnergy(dashboard.energy.generation)],
                ['Verbrauch', formatEnergy(dashboard.energy.consumption)],
                [
                  'Reserve',
                  formatEnergy(dashboard.energy.reserve),
                  dashboard.energy.reserve < 0 ? 'kv-value-error' : 'kv-value-success',
                ],
                [
                  'Netz',
                  dashboard.energy.usesBaselineGrid ? 'Öffentliches Netz (30 MW)' : 'Eigenversorgung',
                ],
                [
                  'Status',
                  dashboard.energy.hasDeficit ? 'Defizit' : 'Stabil',
                  dashboard.energy.hasDeficit ? 'kv-value-warning' : 'kv-value-success',
                ],
              ]}
            />
          )}
        </section>

        <section className="card">
          <h2>Inventar (Standort)</h2>
          <p className="panel-hint">Material direkt an Produktionsgebäuden — bereit für sofortige Nutzung.</p>
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
                rows={dashboard.inventory.items.map((item) => ({
                  resourceId: labelResource(item.resourceId),
                  quantity: item.quantity,
                  reserved: item.reserved,
                  available: item.available,
                }))}
                emptyText="Am Standort ist kein Material."
              />
            )}
          </div>
        </section>

        <section className="card">
          <h2>Lagerhaus</h2>
          <p className="panel-hint">Marktkäufe landen hier. Transport bringt Material zum Produktionsstandort.</p>
          <div className="table-wrap">
            {!dashboard?.company ? (
              <p className="empty">Kein Lagerhaus aktiv.</p>
            ) : (dashboard.warehouseStorage ?? []).length === 0 ? (
              <p className="empty">Kein Lagerhaus aktiv oder Lager leer.</p>
            ) : (
              (dashboard.warehouseStorage ?? []).map((storage) => (
                <div key={storage.buildingId} className="warehouse-block">
                  <h3 className="warehouse-name">{storage.buildingName}</h3>
                  <DataTable
                    columns={[
                      { key: 'resourceId', label: 'Resource' },
                      { key: 'quantity', label: 'Qty' },
                      { key: 'reserved', label: 'Reserved' },
                      { key: 'available', label: 'Available' },
                    ]}
                    rows={storage.items.map((item) => ({
                      resourceId: labelResource(item.resourceId),
                      quantity: item.quantity,
                      reserved: item.reserved,
                      available: item.available,
                    }))}
                    emptyText="Lager ist leer."
                  />
                </div>
              ))
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
                  buildingTypeId: labelBuilding(building.buildingTypeId),
                  status: building.status,
                  position: `${building.x}, ${building.y}`,
                }))}
                emptyText="Noch keine Gebäude."
                renderCell={(key, row) => {
                  if (key !== 'status') {
                    return row[key];
                  }

                  const building = dashboard.buildings.find(
                    (entry) => entry.name === row.name && entry.status === row.status,
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
                  recipeId: labelRecipe(job.recipeId),
                  buildingId: job.buildingId,
                  status: formatProductionStatus(job.status, job.awaitingTransport),
                  progress: formatProgress(job.progress),
                }))}
                emptyText="Keine laufende Produktion."
              />
            )}
          </div>
        </section>

        <section className="card span-2">
          <h2>Transport & Logistik</h2>
          <p className="panel-hint">
            Interner Transport vom Lagerhaus zum Produktionsgebäude (~5 Ticks). Produktion startet nach
            Ankunft aller Lieferungen.
          </p>
          <div className="table-wrap">
            {!dashboard?.company ? (
              <p className="empty">Keine aktiven Transporte.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'resourceId', label: 'Resource' },
                  { key: 'amount', label: 'Menge' },
                  { key: 'route', label: 'Route' },
                  { key: 'recipeName', label: 'Produktion' },
                  { key: 'status', label: 'Status' },
                  { key: 'progress', label: 'Progress' },
                ]}
                rows={(dashboard.transportOrders ?? []).map((order) => ({
                  resourceId: labelResource(order.resourceId),
                  amount: order.amount,
                  route: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
                  recipeName: order.recipeName ?? '—',
                  status: order.status,
                  progress: formatProgress(order.progress),
                }))}
                emptyText="Keine aktiven Transporte — Material am Standort oder Lager leer."
              />
            )}
          </div>
        </section>

        <section className="card">
          <h2>Forschung</h2>
          <div className="table-wrap">
            {!dashboard?.company ? (
              <p className="empty">Keine laufende Forschung.</p>
            ) : (
              <>
                {dashboard.completedResearch.length > 0 ? (
                  <p className="research-done">
                    Abgeschlossen:{' '}
                    {dashboard.completedResearch.map(labelTechnology).join(', ')}
                  </p>
                ) : null}
                <DataTable
                  columns={[
                    { key: 'technologyId', label: 'Technology' },
                    { key: 'status', label: 'Status' },
                    { key: 'progress', label: 'Progress' },
                  ]}
                  rows={dashboard.researchJobs.map((job) => ({
                    technologyId: labelTechnology(job.technologyId),
                    status: job.status,
                    progress: formatProgress(job.progress),
                  }))}
                  emptyText="Keine laufende Forschung."
                />
              </>
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
              rows={(dashboard?.marketPrices ?? []).map((price) => ({
                resourceId: labelResource(price.resourceId),
                lastPrice: price.lastPrice,
                tradeVolume: price.tradeVolume,
              }))}
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
          </>
        )}
      </main>
    </div>
  );
}
