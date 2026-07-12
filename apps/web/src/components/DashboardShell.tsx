'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  buildNameMap,
  callApi,
  fetchDashboard,
  fetchDashboardHistory,
  type BuildingReadModel,
  type GameSessionDashboard,
  type TickMetricsSnapshot,
} from '@/lib/api';
import { TickHistoryCharts } from '@/components/TickHistoryCharts';
import {
  DashboardDetailPanel,
  normalizeDetailSelection,
  type DetailSelection,
} from '@/components/DashboardDetailPanel';

type StatusTone = '' | 'success' | 'error' | 'info';

type TableColumn<T extends string> = {
  readonly key: T;
  readonly label: string;
  readonly numeric?: boolean;
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

function trendLabel(direction: 'up' | 'down' | 'stable', text: string): string {
  const icon = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '→';
  return `${icon} ${text}`;
}

function trendFromHistory(
  points: readonly TickMetricsSnapshot[],
  key: keyof Pick<TickMetricsSnapshot, 'availableCash' | 'energyReserve' | 'activeTransportCount'>,
  stableLabel: string,
): string {
  if (points.length < 2) {
    return trendLabel('stable', stableLabel);
  }

  const previous = points.at(-2)?.[key] ?? 0;
  const current = points.at(-1)?.[key] ?? 0;

  if (current > previous) {
    return trendLabel('up', stableLabel);
  }

  if (current < previous) {
    return trendLabel('down', stableLabel);
  }

  return trendLabel('stable', stableLabel);
}

function KpiStrip({
  kpis,
  history,
}: {
  readonly kpis: GameSessionDashboard['kpis'];
  readonly history: readonly TickMetricsSnapshot[];
}) {
  if (kpis === null) {
    return null;
  }

  return (
    <section className="kpi-strip" aria-label="Kennzahlen">
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          💰
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Verfügbar</span>
          <strong className="kpi-value">{kpis.availableCash.toLocaleString('de-DE')} GC</strong>
          <span className="kpi-trend">
            {trendFromHistory(history, 'availableCash', 'Liquidität')}
          </span>
        </div>
      </article>
      <article className={`kpi-card${kpis.energyHasDeficit ? ' kpi-warning' : ''}`}>
        <span className="kpi-icon" aria-hidden="true">
          ⚡
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Energie-Reserve</span>
          <strong className="kpi-value">{formatEnergy(kpis.energyReserve)}</strong>
          <span className="kpi-trend">
            {kpis.energyHasDeficit
              ? trendLabel('down', 'Defizit')
              : trendFromHistory(history, 'energyReserve', 'Stabil')}
          </span>
        </div>
      </article>
      <article className={`kpi-card${kpis.activeTransportCount > 0 ? ' kpi-active' : ''}`}>
        <span className="kpi-icon" aria-hidden="true">
          🚚
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Transporte</span>
          <strong className="kpi-value">{kpis.activeTransportCount}</strong>
          <span className="kpi-trend">
            {trendFromHistory(history, 'activeTransportCount', 'Aktiv unterwegs')}
          </span>
        </div>
      </article>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          📦
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Im Lagerhaus</span>
          <strong className="kpi-value">{kpis.warehouseTotalUnits}</strong>
          <span className="kpi-trend">{trendLabel('stable', 'Einheiten gesamt')}</span>
        </div>
      </article>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          🏭
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Am Standort</span>
          <strong className="kpi-value">{kpis.onSiteResourceLines}</strong>
          <span className="kpi-trend">{trendLabel('stable', 'Ressourcenlinien')}</span>
        </div>
      </article>
    </section>
  );
}

function OverviewStrip({
  dashboard,
}: {
  readonly dashboard: GameSessionDashboard | null;
}) {
  if (dashboard?.company === null || dashboard?.company === undefined) {
    return null;
  }

  const runningProduction = dashboard.productionJobs.filter((job) => job.status === 'RUNNING').length;
  const waitingProduction = dashboard.productionJobs.filter((job) => job.status === 'WAITING').length;
  const activeResearch = dashboard.researchJobs.filter((job) => job.status === 'IN_PROGRESS').length;
  const activeTransport = dashboard.logistics?.activeTransportCount ?? 0;
  const completedMilestones = dashboard.completedMilestones.length;

  return (
    <section className="overview-strip" aria-label="Überblick">
      <article className="overview-card">
        <span className="overview-label">Gebäude</span>
        <strong className="overview-value">{dashboard.buildings.length}</strong>
        <span className="overview-hint">Standorte &amp; Anlagen</span>
      </article>
      <article className="overview-card">
        <span className="overview-label">Produktion</span>
        <strong className="overview-value">{runningProduction}</strong>
        <span className="overview-hint">
          {waitingProduction > 0 ? `${waitingProduction} wartend` : 'Keine Warteschlange'}
        </span>
      </article>
      <article className="overview-card">
        <span className="overview-label">Forschung</span>
        <strong className="overview-value">{activeResearch}</strong>
        <span className="overview-hint">{dashboard.completedResearch.length} abgeschlossen</span>
      </article>
      <article className="overview-card">
        <span className="overview-label">Transport</span>
        <strong className="overview-value">{activeTransport}</strong>
        <span className="overview-hint">
          {dashboard.logistics?.waitingProductionCount
            ? `${dashboard.logistics.waitingProductionCount} Jobs warten`
            : 'Logistik stabil'}
        </span>
      </article>
      <article className="overview-card">
        <span className="overview-label">Meilensteine</span>
        <strong className="overview-value">{completedMilestones}</strong>
        <span className="overview-hint">von {dashboard.milestones.length} erreicht</span>
      </article>
      <article className="overview-card">
        <span className="overview-label">Markt</span>
        <strong className="overview-value">{dashboard.marketPrices.length}</strong>
        <span className="overview-hint">Handelbare Ressourcen</span>
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
  rowKeys,
  selectedRowKey,
  onRowSelect,
  emptyText,
  emptyHint,
  renderCell,
}: {
  readonly columns: readonly TableColumn<T>[];
  readonly rows: ReadonlyArray<Partial<Record<T, string | number>>>;
  readonly rowKeys?: readonly string[];
  readonly selectedRowKey?: string | null;
  readonly onRowSelect?: (rowKey: string) => void;
  readonly emptyText: string;
  readonly emptyHint?: string;
  readonly renderCell?: (key: T, row: Partial<Record<T, string | number>>) => ReactNode;
}) {
  const isSelectable = rowKeys !== undefined && onRowSelect !== undefined;

  if (rows.length === 0) {
    return (
      <p className="empty-state">
        <strong>{emptyText}</strong>
        {emptyHint ? emptyHint : null}
      </p>
    );
  }

  return (
    <table className="table-sticky">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.numeric ? 'numeric' : undefined}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const rowKey = rowKeys?.[rowIndex] ?? String(rowIndex);
          const isSelected = selectedRowKey === rowKey;

          return (
            <tr
              key={rowKey}
              className={`${isSelectable ? 'table-row-selectable' : ''}${isSelected ? ' table-row-selected' : ''}`.trim()}
              tabIndex={isSelectable ? 0 : undefined}
              aria-selected={isSelectable ? isSelected : undefined}
              onClick={
                isSelectable
                  ? () => {
                      onRowSelect(rowKey);
                    }
                  : undefined
              }
              onKeyDown={
                isSelectable
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onRowSelect(rowKey);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((column) => (
                <td key={column.key} className={column.numeric ? 'numeric' : undefined}>
                  {renderCell?.(column.key, row) ?? row[column.key] ?? ''}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SidebarActions({
  hasGame,
  hints,
  buildingCount,
  runAction,
}: {
  readonly hasGame: boolean;
  readonly hints: GameSessionDashboard['hints'] | undefined;
  readonly buildingCount: number;
  readonly runAction: (action: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
  return (
    <>
      <p className="sidebar-title">Aktionen</p>

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
        {(hints?.placeBuilding ?? []).length === 0 ? (
          <p className="empty-state">Keine Bauoptionen verfügbar.</p>
        ) : (
          (hints?.placeBuilding ?? []).map((hint) => (
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
          ))
        )}
      </div>

      <div className="toolbar-group">
        <span className="toolbar-label">Produktion</span>
        {(hints?.production ?? []).length === 0 ? (
          <p className="empty-state">Keine Produktionsaktionen möglich.</p>
        ) : (
          (hints?.production ?? []).map((hint) => (
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
          ))
        )}
      </div>

      <div className="toolbar-group">
        <span className="toolbar-label">Markt</span>
        {(hints?.market ?? []).length === 0 ? (
          <p className="empty-state">Keine Marktaktionen verfügbar.</p>
        ) : (
          (hints?.market ?? []).flatMap((hint) => [
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
          ])
        )}
      </div>

      <div className="toolbar-group">
        <span className="toolbar-label">Forschung</span>
        {(hints?.research ?? []).length === 0 ? (
          <p className="empty-state">Keine Forschungsprojekte startbar.</p>
        ) : (
          (hints?.research ?? []).map((hint) => (
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
          ))
        )}
      </div>
    </>
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
  const [tickHistory, setTickHistory] = useState<readonly TickMetricsSnapshot[]>([]);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<StatusTone>('');
  const [detailSelection, setDetailSelection] = useState<DetailSelection>({ kind: 'overview' });

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
    const [nextDashboard, nextHistory] = await Promise.all([
      fetchDashboard(),
      fetchDashboardHistory({ limit: 200 }),
    ]);
    setDashboard(nextDashboard);
    setTickHistory(nextHistory.points);
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

  useEffect(() => {
    setDetailSelection((current) => normalizeDetailSelection(dashboard, current));
  }, [dashboard]);

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
        setSidebarOpen(false);
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

  const selectedRowKey =
    detailSelection.kind === 'overview'
      ? null
      : `${detailSelection.kind}:${detailSelection.id}`;

  const selectDetail = useCallback(
    (kind: 'building' | 'production' | 'transport' | 'research', id: string) => {
      setDetailSelection({ kind, id });
    },
    [],
  );

  const clearDetailSelection = useCallback(() => {
    setDetailSelection({ kind: 'overview' });
  }, []);

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

      {sidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Seitenleiste schließen"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <header className="header">
        <div>
          <p className="eyebrow">Deterministic Economy Simulation</p>
          <h1>{dashboard?.company?.name ?? 'Project Genesis'}</h1>
          {hasGame ? (
            <p className="header-subtitle">
              Unternehmens-Dashboard · Tick {dashboard?.tickNumber ?? '—'} · Zeit{' '}
              {dashboard?.simulationTime ?? '—'}
            </p>
          ) : (
            <p className="header-subtitle">Starten Sie eine neue Session, um das Spiel zu beginnen.</p>
          )}
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn-secondary mobile-only"
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-sidebar"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            Aktionen
          </button>
          <button
            type="button"
            className="btn-secondary theme-toggle"
            aria-label={theme === 'light' ? 'Dark Mode aktivieren' : 'Light Mode aktivieren'}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          {dashboard?.energy?.hasDeficit ? (
            <span
              className="meta-pill"
              style={{ color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.45)' }}
            >
              Energie-Defizit
            </span>
          ) : null}
        </div>
      </header>

      <div className="dashboard-body">
        <aside
          id="dashboard-sidebar"
          className={`dashboard-sidebar${sidebarOpen ? ' is-open' : ''}`}
          aria-label="Dashboard-Aktionen"
        >
          <SidebarActions
            hasGame={hasGame}
            hints={hints}
            buildingCount={buildingCount}
            runAction={runAction}
          />
        </aside>

        <div className="dashboard-content">
          {hasGame && dashboard?.kpis ? (
            <KpiStrip kpis={dashboard.kpis} history={tickHistory} />
          ) : null}

          <div className="status-bar">
            <LogisticsBanner message={dashboard?.logistics?.statusMessage ?? null} />
            <Toast message={statusMessage} tone={statusTone} />
          </div>

          {hasGame ? <OverviewStrip dashboard={dashboard} /> : null}

          {hasGame ? <TickHistoryCharts points={tickHistory} /> : null}

          <div className="dashboard-panels">
            <div className="dashboard-tables">
              {isInitialLoading ? (
                <>
                  <section className="card card-loading">
                    <div className="skeleton-block" style={{ width: '40%' }} />
                    <div className="skeleton-block" style={{ width: '70%', marginTop: '0.75rem' }} />
                  </section>
                  <section className="card card-loading">
                    <div className="skeleton-block" style={{ width: '55%' }} />
                  </section>
                </>
              ) : (
                <>
                  <section className="card">
                    <div className="section-header">
                      <h2>Gebäude</h2>
                      <p>Alle Standorte, Baufortschritt und Status.</p>
                    </div>
                    <div className="table-wrap">
                      {!dashboard?.company ? (
                        <p className="empty-state">
                          <strong>Noch keine Gebäude.</strong>
                          Nutzen Sie die Aktionen in der Seitenleiste, um ein Gebäude zu platzieren.
                        </p>
                      ) : (
                        <DataTable
                          columns={[
                            { key: 'name', label: 'Name' },
                            { key: 'buildingTypeId', label: 'Typ' },
                            { key: 'status', label: 'Status' },
                            { key: 'position', label: 'Pos' },
                          ]}
                          rows={dashboard.buildings.map((building) => ({
                            name: building.name,
                            buildingTypeId: labelBuilding(building.buildingTypeId),
                            status: building.status,
                            position: `${building.x}, ${building.y}`,
                          }))}
                          rowKeys={dashboard.buildings.map((building) => `building:${building.id}`)}
                          selectedRowKey={selectedRowKey}
                          onRowSelect={(rowKey) => {
                            selectDetail('building', rowKey.slice('building:'.length));
                          }}
                          emptyText="Noch keine Gebäude."
                          emptyHint="Platzieren Sie über die Seitenleiste Ihr erstes Gebäude."
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

                  <div className="table-grid">
                    <section className="card">
                      <div className="section-header">
                        <h2>Produktion</h2>
                        <p>Laufende und wartende Fertigungsaufträge.</p>
                      </div>
                      <div className="table-wrap">
                        {!dashboard?.company ? (
                          <p className="empty-state">
                            <strong>Keine laufende Produktion.</strong>
                            Starten Sie einen Auftrag über die Seitenleiste.
                          </p>
                        ) : (
                          <DataTable
                            columns={[
                              { key: 'recipeId', label: 'Rezept' },
                              { key: 'buildingId', label: 'Gebäude' },
                              { key: 'status', label: 'Status' },
                              { key: 'progress', label: 'Fortschritt', numeric: true },
                            ]}
                            rows={dashboard.productionJobs.map((job) => ({
                              recipeId: labelRecipe(job.recipeId),
                              buildingId: job.buildingId,
                              status: formatProductionStatus(job.status, job.awaitingTransport),
                              progress: formatProgress(job.progress),
                            }))}
                            rowKeys={dashboard.productionJobs.map((job) => `production:${job.id}`)}
                            selectedRowKey={selectedRowKey}
                            onRowSelect={(rowKey) => {
                              selectDetail('production', rowKey.slice('production:'.length));
                            }}
                            emptyText="Keine laufende Produktion."
                            emptyHint="Bauen Sie eine Fabrik und starten Sie ein Rezept."
                          />
                        )}
                      </div>
                    </section>

                    <section className="card">
                      <div className="section-header">
                        <h2>Forschung</h2>
                        <p>Aktive Technologieprojekte und abgeschlossene Forschung.</p>
                      </div>
                      <div className="table-wrap">
                        {!dashboard?.company ? (
                          <p className="empty-state">
                            <strong>Keine laufende Forschung.</strong>
                            Starten Sie ein Projekt in der Seitenleiste.
                          </p>
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
                                { key: 'technologyId', label: 'Technologie' },
                                { key: 'status', label: 'Status' },
                                { key: 'progress', label: 'Fortschritt', numeric: true },
                              ]}
                              rows={dashboard.researchJobs.map((job) => ({
                                technologyId: labelTechnology(job.technologyId),
                                status: job.status,
                                progress: formatProgress(job.progress),
                              }))}
                              rowKeys={dashboard.researchJobs.map((job) => `research:${job.id}`)}
                              selectedRowKey={selectedRowKey}
                              onRowSelect={(rowKey) => {
                                selectDetail('research', rowKey.slice('research:'.length));
                              }}
                              emptyText="Keine laufende Forschung."
                              emptyHint="Erforschen Sie neue Technologien für bessere Produktion."
                            />
                          </>
                        )}
                      </div>
                    </section>
                  </div>

                  <section className="card">
                    <div className="section-header">
                      <h2>Transport &amp; Logistik</h2>
                      <p>
                        Interner Transport vom Lagerhaus zum Produktionsgebäude (~5 Ticks). Produktion
                        startet nach Ankunft aller Lieferungen.
                      </p>
                    </div>
                    <div className="table-wrap">
                      {!dashboard?.company ? (
                        <p className="empty-state">
                          <strong>Keine aktiven Transporte.</strong>
                          Kaufen Sie Material am Markt — es landet im Lagerhaus.
                        </p>
                      ) : (
                        <DataTable
                          columns={[
                            { key: 'resourceId', label: 'Ressource' },
                            { key: 'amount', label: 'Menge', numeric: true },
                            { key: 'route', label: 'Route' },
                            { key: 'recipeName', label: 'Produktion' },
                            { key: 'status', label: 'Status' },
                            { key: 'progress', label: 'Fortschritt', numeric: true },
                          ]}
                          rows={(dashboard.transportOrders ?? []).map((order) => ({
                            resourceId: labelResource(order.resourceId),
                            amount: order.amount,
                            route: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
                            recipeName: order.recipeName ?? '—',
                            status: order.status,
                            progress: formatProgress(order.progress),
                          }))}
                          rowKeys={(dashboard.transportOrders ?? []).map(
                            (order) => `transport:${order.id}`,
                          )}
                          selectedRowKey={selectedRowKey}
                          onRowSelect={(rowKey) => {
                            selectDetail('transport', rowKey.slice('transport:'.length));
                          }}
                          emptyText="Keine aktiven Transporte."
                          emptyHint="Material am Standort oder Lager leer — Marktkäufe lösen Transport aus."
                        />
                      )}
                    </div>
                  </section>

                  <div className="table-grid">
                    <section className="card">
                      <div className="section-header">
                        <h2>Inventar (Standort)</h2>
                        <p>Material direkt an Produktionsgebäuden — bereit für sofortige Nutzung.</p>
                      </div>
                      <div className="table-wrap">
                        {!dashboard?.inventory ? (
                          <p className="empty-state">
                            <strong>Inventar erscheint nach Spielstart.</strong>
                          </p>
                        ) : (
                          <DataTable
                            columns={[
                              { key: 'resourceId', label: 'Ressource' },
                              { key: 'quantity', label: 'Menge', numeric: true },
                              { key: 'reserved', label: 'Reserviert', numeric: true },
                              { key: 'available', label: 'Verfügbar', numeric: true },
                            ]}
                            rows={dashboard.inventory.items.map((item) => ({
                              resourceId: labelResource(item.resourceId),
                              quantity: item.quantity,
                              reserved: item.reserved,
                              available: item.available,
                            }))}
                            emptyText="Am Standort ist kein Material."
                            emptyHint="Produzieren oder transportieren Sie Ressourcen zum Standort."
                          />
                        )}
                      </div>
                    </section>

                    <section className="card">
                      <div className="section-header">
                        <h2>Lagerhaus</h2>
                        <p>Marktkäufe landen hier. Transport bringt Material zum Produktionsstandort.</p>
                      </div>
                      <div className="table-wrap">
                        {!dashboard?.company ? (
                          <p className="empty-state">
                            <strong>Kein Lagerhaus aktiv.</strong>
                            Bauen Sie ein Lagerhaus, um Marktkäufe zu lagern.
                          </p>
                        ) : (dashboard.warehouseStorage ?? []).length === 0 ? (
                          <p className="empty-state">
                            <strong>Kein Lagerhaus aktiv oder Lager leer.</strong>
                            Kaufen Sie Ressourcen am Markt.
                          </p>
                        ) : (
                          (dashboard.warehouseStorage ?? []).map((storage) => (
                            <div key={storage.buildingId} className="warehouse-block">
                              <h3 className="warehouse-name">{storage.buildingName}</h3>
                              <DataTable
                                columns={[
                                  { key: 'resourceId', label: 'Ressource' },
                                  { key: 'quantity', label: 'Menge', numeric: true },
                                  { key: 'reserved', label: 'Reserviert', numeric: true },
                                  { key: 'available', label: 'Verfügbar', numeric: true },
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
                  </div>
                </>
              )}
            </div>

            <DashboardDetailPanel
              dashboard={dashboard}
              selection={detailSelection}
              onClearSelection={clearDetailSelection}
              labelBuilding={labelBuilding}
              labelRecipe={labelRecipe}
              labelResource={labelResource}
              labelTechnology={labelTechnology}
              renderMarketTable={
                <DataTable
                  columns={[
                    { key: 'resourceId', label: 'Ressource' },
                    { key: 'lastPrice', label: 'Preis', numeric: true },
                    { key: 'tradeVolume', label: 'Volumen', numeric: true },
                  ]}
                  rows={(dashboard?.marketPrices ?? []).map((price) => ({
                    resourceId: labelResource(price.resourceId),
                    lastPrice: price.lastPrice,
                    tradeVolume: price.tradeVolume,
                  }))}
                  emptyText="Keine Marktpreise geladen."
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
