'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { InventoryHistoryChart } from '@/components/InventoryHistoryChart';
import { MarketPriceHistoryChart } from '@/components/MarketPriceHistoryChart';
import { MarketSupplyDemandChart } from '@/components/MarketSupplyDemandChart';
import { MarketPressureHistoryChart } from '@/components/MarketPressureHistoryChart';
import { PriceIndexHistoryChart } from '@/components/PriceIndexHistoryChart';
import { MarketPricesTable } from '@/components/MarketPricesTable';
import { EnergyHistoryChart } from '@/components/EnergyHistoryChart';
import {
  DashboardDetailPanel,
  normalizeDetailSelection,
  type DetailSelection,
} from '@/components/DashboardDetailPanel';
import { DataTable } from '@/components/DataTable';
import { TutorialPanel } from '@/components/TutorialPanel';
import { DashboardIcon, type DashboardIconName } from '@/components/icons/DashboardIcons';
import { connectDashboardSocket } from '@/lib/dashboard-socket';

type StatusTone = '' | 'success' | 'error' | 'info';

function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

function formatEnergy(value: number): string {
  return `${value.toFixed(1)} MW`;
}

function formatTransportStatus(status: string): string {
  if (status === 'WAITING') {
    return 'Warteschlange';
  }

  if (status === 'IN_PROGRESS') {
    return 'Unterwegs';
  }

  if (status === 'COMPLETED') {
    return 'Abgeschlossen';
  }

  return status;
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

function formatTransactionType(type: string): string {
  const labels: Record<string, string> = {
    SALE: 'Verkauf',
    PURCHASE: 'Einkauf',
    PRODUCTION_COST: 'Produktionskosten',
    BUILDING_COST: 'Baukosten',
    BUILDING_REFUND: 'Bau-Rückerstattung',
    RESEARCH_COST: 'Forschungskosten',
    RESEARCH_REWARD: 'Forschungsprämie',
    MAINTENANCE: 'Wartung',
    SALARY: 'Gehalt',
    LOAN_RECEIVED: 'Kredit erhalten',
    LOAN_PAYMENT: 'Kreditrate',
    INTEREST: 'Zinsen',
    MARKET_FEE: 'Marktgebühr',
    TRANSPORT_COST: 'Transportkosten',
    CONTRACT_PAYMENT: 'Vertragszahlung',
    NPC_REWARD: 'NPC-Belohnung',
    TAX: 'Steuer',
    ADMIN: 'Administration',
    SYSTEM: 'System',
  };

  return labels[type] ?? type;
}

function formatTransactionAmount(direction: string, amount: number): string {
  if (direction === 'IN') {
    return `+${amount.toLocaleString('de-DE')}`;
  }

  if (direction === 'OUT') {
    return `−${amount.toLocaleString('de-DE')}`;
  }

  return amount.toLocaleString('de-DE');
}

function KpiStrip({
  kpis,
  history,
  onSelectFinance,
  onSelectLogistics,
}: {
  readonly kpis: GameSessionDashboard['kpis'];
  readonly history: readonly TickMetricsSnapshot[];
  readonly onSelectFinance: () => void;
  readonly onSelectLogistics: () => void;
}) {
  if (kpis === null) {
    return null;
  }

  return (
    <section className="kpi-strip" aria-label="Kennzahlen">
      <button type="button" className="kpi-card kpi-card-button" onClick={onSelectFinance}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="cash" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Verfügbar</span>
          <strong className="kpi-value">{kpis.availableCash.toLocaleString('de-DE')} GC</strong>
          <span className="kpi-trend">
            {trendFromHistory(history, 'availableCash', 'Liquidität')}
          </span>
        </div>
      </button>
      <article className={`kpi-card${kpis.energyHasDeficit ? ' kpi-warning' : ''}`}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="energy" className="dashboard-icon" />
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
      <button
        type="button"
        className={`kpi-card kpi-card-button${kpis.activeTransportCount > 0 ? ' kpi-active' : ''}`}
        onClick={onSelectLogistics}
      >
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="transport" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Transporte</span>
          <strong className="kpi-value">{kpis.activeTransportCount}</strong>
          <span className="kpi-trend">
            {trendFromHistory(history, 'activeTransportCount', 'Aktiv unterwegs')}
          </span>
        </div>
      </button>
      <button type="button" className="kpi-card kpi-card-button" onClick={onSelectLogistics}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="warehouse" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Im Lagerhaus</span>
          <strong className="kpi-value">{kpis.warehouseTotalUnits}</strong>
          <span className="kpi-trend">
            {kpis.warehouseStorageCapacity > 0
              ? `${kpis.warehouseUsedCapacity}/${kpis.warehouseStorageCapacity} Kapazität`
              : trendLabel('stable', 'Einheiten gesamt')}
          </span>
        </div>
      </button>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="onsite" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Am Standort</span>
          <strong className="kpi-value">{kpis.onSiteResourceLines}</strong>
          <span className="kpi-trend">{trendLabel('stable', 'Ressourcenlinien')}</span>
        </div>
      </article>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="employees" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Mitarbeiter</span>
          <strong className="kpi-value">
            {kpis.assignedEmployeeCount}/{kpis.employeeCount}
          </strong>
          <span className="kpi-trend">
            {kpis.payrollPerInterval.toLocaleString('de-DE')} GC Payroll / 10 Ticks
          </span>
        </div>
      </article>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="info" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Preisindex</span>
          <strong className="kpi-value">{kpis.priceIndex.toFixed(2)}</strong>
          <span className="kpi-trend">{trendLabel('stable', 'Neutral bei 1,00')}</span>
        </div>
      </article>
      <article className={`kpi-card${kpis.taxPaymentBlocked ? ' kpi-warning' : ''}`}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="cash" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Steuer / Verträge</span>
          <strong className="kpi-value">{(kpis.corporateTaxRate * 100).toFixed(0)} %</strong>
          <span className="kpi-trend">
            {kpis.taxPaymentBlocked
              ? trendLabel('down', `${kpis.pendingTaxAmount.toLocaleString('de-DE')} GC offen · Kasse zu niedrig`)
              : `${kpis.activeContractCount} aktiv · alle ${kpis.taxIntervalTicks} Ticks`}
          </span>
        </div>
      </article>
    </section>
  );
}

function OverviewStrip({
  dashboard,
  onSelectLogistics,
}: {
  readonly dashboard: GameSessionDashboard | null;
  readonly onSelectLogistics: () => void;
}) {
  if (dashboard?.company === null || dashboard?.company === undefined) {
    return null;
  }

  const runningProduction = dashboard.productionJobs.filter((job) => job.status === 'RUNNING').length;
  const waitingProduction = dashboard.productionJobs.filter((job) => job.status === 'WAITING').length;
  const activeResearch = dashboard.researchJobs.filter((job) => job.status === 'IN_PROGRESS').length;
  const activeTransport = dashboard.logistics?.activeTransportCount ?? 0;
  const queuedTransport = dashboard.logistics?.queuedTransportCount ?? 0;
  const completedMilestones = dashboard.completedMilestones.length;
  const assignedEmployees =
    dashboard.kpis?.assignedEmployeeCount ??
    dashboard.employees.filter((employee) => employee.assignedBuildingId !== null).length;

  return (
    <section className="overview-strip" aria-label="Überblick">
      <article className="overview-card">
        <span className="overview-label">Gebäude</span>
        <strong className="overview-value">{dashboard.buildings.length}</strong>
        <span className="overview-hint">Standorte &amp; Anlagen</span>
      </article>
      <article className="overview-card">
        <span className="overview-label">Mitarbeiter</span>
        <strong className="overview-value">{dashboard.employees.length}</strong>
        <span className="overview-hint">
          {assignedEmployees > 0
            ? `${assignedEmployees} zugewiesen`
            : 'Noch keine Zuweisungen'}
        </span>
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
      <button type="button" className="overview-card overview-card-button" onClick={onSelectLogistics}>
        <span className="overview-label">Transport</span>
        <strong className="overview-value">{activeTransport}</strong>
        <span className="overview-hint">
          {queuedTransport > 0
            ? `${queuedTransport} in Warteschlange`
            : dashboard.logistics?.waitingProductionCount
              ? `${dashboard.logistics.waitingProductionCount} Jobs warten`
              : 'Logistik stabil'}
        </span>
      </button>
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
  onSelectLogistics,
}: {
  readonly message: string | null;
  readonly onSelectLogistics: () => void;
}) {
  if (message === null || message.length === 0) {
    return null;
  }

  return (
    <button type="button" className="logistics-banner logistics-banner-button" onClick={onSelectLogistics}>
      {message}
    </button>
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

  const iconName: DashboardIconName =
    tone === 'success' ? 'success' : tone === 'error' ? 'error' : tone === 'info' ? 'info' : 'info';

  return (
    <p className={`toast toast-visible ${tone}`.trim()} role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">
        <DashboardIcon name={iconName} className="dashboard-icon dashboard-icon-sm" />
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

      <div className="toolbar-group">
        <span className="toolbar-label">Personal</span>
        {(hints?.hireEmployee ?? []).length === 0 ? (
          <p className="empty-state">Keine Einstellungsoptionen verfügbar.</p>
        ) : (
          (hints?.hireEmployee ?? []).map((hint) => (
            <HintButton
              key={hint.employeeTypeId}
              label={`${hint.name} (${hint.cost.toLocaleString('de-DE')} GC)`}
              disabled={!hasGame || !hint.canHire}
              reason={hint.reason}
              onClick={() => {
                void runAction(
                  () =>
                    callApi('/api/employees/hire', {
                      method: 'POST',
                      body: JSON.stringify({
                        employeeTypeId: hint.employeeTypeId,
                        displayName: hint.defaultDisplayName,
                      }),
                    }),
                  `${hint.name} eingestellt.`,
                );
              }}
            />
          ))
        )}
        {(hints?.assignEmployee ?? []).filter((hint) => hint.canAssign).length === 0 ? (
          <p className="empty-state">Keine Zuweisungen möglich.</p>
        ) : (
          (hints?.assignEmployee ?? [])
            .filter((hint) => hint.canAssign)
            .map((hint) => (
              <HintButton
                key={`${hint.employeeId}-${hint.buildingId}`}
                label={`${hint.employeeName} → ${hint.buildingName}`}
                variant="secondary"
                disabled={!hasGame}
                reason={hint.reason}
                onClick={() => {
                  void runAction(
                    () =>
                      callApi('/api/employees/assign', {
                        method: 'POST',
                        body: JSON.stringify({
                          employeeId: hint.employeeId,
                          buildingId: hint.buildingId,
                        }),
                      }),
                    `${hint.employeeName} zugewiesen.`,
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
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [detailSelection, setDetailSelection] = useState<DetailSelection>({ kind: 'overview' });

  const nameMaps = useMemo(() => {
    if (dashboard === null) {
      return {
        resources: new Map<string, string>(),
        buildings: new Map<string, string>(),
        recipes: new Map<string, string>(),
        technologies: new Map<string, string>(),
        employees: new Map<string, string>(),
      };
    }

    return {
      resources: buildNameMap(dashboard.contentNames.resources),
      buildings: buildNameMap(dashboard.contentNames.buildings),
      recipes: buildNameMap(dashboard.contentNames.recipes),
      technologies: buildNameMap(dashboard.contentNames.technologies),
      employees: buildNameMap(dashboard.contentNames.employees),
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
    let active = true;

    const socket = connectDashboardSocket(
      () => {
        if (!active || isBusy) {
          return;
        }

        void refreshDashboard().catch(() => {
          /* silent background refresh */
        });
      },
      (connected) => {
        if (active) {
          setIsLiveConnected(connected);
        }
      },
    );

    return () => {
      active = false;
      socket.disconnect();
    };
  }, [isBusy, refreshDashboard]);

  useEffect(() => {
    setDetailSelection((current) => normalizeDetailSelection(dashboard, current));
  }, [dashboard]);

  useEffect(() => {
    if (statusMessage.length === 0 || statusTone === '') {
      return undefined;
    }

    const dismissMs = statusTone === 'error' ? 7000 : statusTone === 'info' ? 0 : 4500;

    if (dismissMs === 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage('');
      setStatusTone('');
    }, dismissMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [statusMessage, statusTone]);

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
  const labelEmployee = (employeeTypeId: string) =>
    nameMaps.employees.get(employeeTypeId) ?? employeeTypeId;

  const selectedRowKey =
    detailSelection.kind === 'overview' ||
    detailSelection.kind === 'finance' ||
    detailSelection.kind === 'logistics'
      ? null
      : detailSelection.kind === 'transaction'
        ? `transaction:${detailSelection.id}`
        : detailSelection.kind === 'warehouse'
          ? `warehouse:${detailSelection.id}`
          : `${detailSelection.kind}:${detailSelection.id}`;

  const selectDetail = useCallback(
    (
      kind:
        | 'building'
        | 'production'
        | 'transport'
        | 'research'
        | 'employee'
        | 'transaction'
        | 'warehouse',
      id: string,
    ) => {
      setDetailSelection({ kind, id });
    },
    [],
  );

  const selectFinanceDetail = useCallback(() => {
    setDetailSelection({ kind: 'finance' });
  }, []);

  const selectLogisticsDetail = useCallback(() => {
    setDetailSelection({ kind: 'logistics' });
  }, []);

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
          {isLiveConnected ? (
            <span className="meta-pill meta-pill-live" title="Live-Updates aktiv">
              Live
            </span>
          ) : null}
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
            <KpiStrip
              kpis={dashboard.kpis}
              history={tickHistory}
              onSelectFinance={selectFinanceDetail}
              onSelectLogistics={selectLogisticsDetail}
            />
          ) : null}

          <div className="status-bar">
            <LogisticsBanner
              message={dashboard?.logistics?.statusMessage ?? null}
              onSelectLogistics={selectLogisticsDetail}
            />
            <Toast message={statusMessage} tone={statusTone} />
          </div>

          {hasGame ? <OverviewStrip dashboard={dashboard} onSelectLogistics={selectLogisticsDetail} /> : null}

          {hasGame ? <TutorialPanel tutorial={dashboard?.tutorial} /> : null}

          {hasGame ? <TickHistoryCharts points={tickHistory} /> : null}

          {hasGame ? <InventoryHistoryChart points={tickHistory} /> : null}

          {hasGame ? <EnergyHistoryChart points={tickHistory} /> : null}

          {hasGame ? (
            <MarketPriceHistoryChart points={tickHistory} labelResource={labelResource} />
          ) : null}

          {hasGame ? (
            <MarketSupplyDemandChart
              marketPrices={dashboard?.marketPrices ?? []}
              labelResource={labelResource}
            />
          ) : null}

          {hasGame ? (
            <MarketPressureHistoryChart points={tickHistory} labelResource={labelResource} />
          ) : null}

          {hasGame ? <PriceIndexHistoryChart points={tickHistory} /> : null}

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
                          searchable
                          searchPlaceholder="Gebäude suchen…"
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

                  <section className="card">
                    <div className="section-header">
                      <h2>Mitarbeiter</h2>
                      <p>Eingestelltes Personal, Gehälter und Gebäudezuweisungen.</p>
                    </div>
                    <div className="table-wrap">
                      {!dashboard?.company ? (
                        <p className="empty-state">
                          <strong>Noch keine Mitarbeiter.</strong>
                          Stellen Sie Personal über die Seitenleiste ein.
                        </p>
                      ) : (
                        <DataTable
                          searchable
                          searchPlaceholder="Mitarbeiter suchen…"
                          columns={[
                            { key: 'displayName', label: 'Name' },
                            { key: 'employeeTypeId', label: 'Typ' },
                            { key: 'salary', label: 'Gehalt', numeric: true },
                            { key: 'productivity', label: 'Produktivität', numeric: true },
                            { key: 'assignment', label: 'Zuweisung' },
                          ]}
                          rows={dashboard.employees.map((employee) => ({
                            displayName: employee.displayName,
                            employeeTypeId: labelEmployee(employee.employeeTypeId),
                            salary: employee.salary,
                            productivity: employee.productivity.toFixed(2),
                            assignment: employee.assignedBuildingName ?? '—',
                          }))}
                          rowKeys={dashboard.employees.map((employee) => `employee:${employee.id}`)}
                          selectedRowKey={selectedRowKey}
                          onRowSelect={(rowKey) => {
                            selectDetail('employee', rowKey.slice('employee:'.length));
                          }}
                          emptyText="Noch keine Mitarbeiter."
                          emptyHint="Stellen Sie Produktions- oder Logistikpersonal ein."
                        />
                      )}
                    </div>
                  </section>

                  <section className={`card${dashboard?.economy?.taxPaymentBlocked ? ' card-warning' : ''}`}>
                    <div className="section-header">
                      <h2>Wirtschaft</h2>
                      <p>
                        Unternehmenssteuer {(dashboard?.economy?.corporateTaxRate ?? 0.05) * 100} % alle{' '}
                        {dashboard?.economy?.taxIntervalTicks ?? 30} Ticks · Preisindex{' '}
                        {(dashboard?.economy?.priceIndex ?? 1).toFixed(2)} (neutral 1,00). Lieferverträge
                        entnehmen Ressourcen nur aus dem Standort-Inventar, nicht aus Lagerhaus-Beständen.
                      </p>
                    </div>
                    {dashboard?.economy?.taxPaymentBlocked ? (
                      <p className="empty-state kv-value-warning" role="status">
                        <strong>Steuer offen:</strong>{' '}
                        {dashboard.economy.pendingTaxAmount.toLocaleString('de-DE')} GC fällig, aber die Kasse
                        reicht nicht — die Abbuchung wird übersprungen, bis genug Cash vorhanden ist.
                      </p>
                    ) : null}
                    <div className="table-wrap">
                      {!dashboard?.company || (dashboard.economy?.contracts.length ?? 0) === 0 ? (
                        <p className="empty-state">
                          <strong>Keine Lieferverträge.</strong>
                          NPC-Verträge erscheinen nach Spielstart automatisch.
                        </p>
                      ) : (
                        <DataTable
                          searchable={false}
                          columns={[
                            { key: 'resourceId', label: 'Ressource' },
                            { key: 'amount', label: 'Menge', numeric: true },
                            { key: 'paymentAmount', label: 'Zahlung', numeric: true },
                            { key: 'intervalTicks', label: 'Intervall', numeric: true },
                            { key: 'status', label: 'Status' },
                          ]}
                          rows={(dashboard.economy?.contracts ?? []).map((contract) => ({
                            resourceId: labelResource(contract.resourceId),
                            amount: contract.amount,
                            paymentAmount: `${contract.paymentAmount.toLocaleString('de-DE')} GC`,
                            intervalTicks: `${contract.intervalTicks} Ticks`,
                            status: contract.active ? 'Aktiv' : 'Inaktiv',
                          }))}
                          rowKeys={(dashboard.economy?.contracts ?? []).map(
                            (contract) => `contract:${contract.id}`,
                          )}
                          emptyText="Keine Verträge."
                        />
                      )}
                    </div>
                  </section>

                  <section className="card">
                    <div className="section-header">
                      <h2>Markt</h2>
                      <p>Preise, Angebot, Nachfrage und Trend je Ressource. Handelsgebühr: 2&nbsp;% (min. 1 GC) pro Transaktion.</p>
                    </div>
                    <div className="table-wrap">
                      {!dashboard?.company ? (
                        <p className="empty-state">
                          <strong>Noch keine Marktdaten.</strong>
                          Starten Sie ein Spiel, um dynamische Preise zu sehen.
                        </p>
                      ) : (
                        <MarketPricesTable
                          marketPrices={dashboard.marketPrices}
                          labelResource={labelResource}
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
                            searchable
                            searchPlaceholder="Produktion suchen…"
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
                              searchable
                              searchPlaceholder="Forschung suchen…"
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
                        Interner Transport vom Lagerhaus zum Produktionsgebäude (Dauer aus
                        Routen-Content). Produktion startet nach Ankunft aller Lieferungen.
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
                          searchable
                          searchPlaceholder="Transporte suchen…"
                          columns={[
                            { key: 'resourceId', label: 'Ressource' },
                            { key: 'amount', label: 'Menge', numeric: true },
                            { key: 'route', label: 'Route' },
                            { key: 'recipeName', label: 'Produktion' },
                            { key: 'status', label: 'Status' },
                            { key: 'durationTicks', label: 'Dauer (Ticks)', numeric: true },
                            { key: 'progress', label: 'Fortschritt', numeric: true },
                          ]}
                          rows={(dashboard.transportOrders ?? []).map((order) => ({
                            resourceId: labelResource(order.resourceId),
                            amount: order.amount,
                            route: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
                            recipeName: order.recipeName ?? '—',
                            status: formatTransportStatus(order.status),
                            durationTicks: order.durationTicks,
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

                  <section className="card">
                    <div className="section-header">
                      <h2>Finanzbuchungen</h2>
                      <p>Ledger-Einträge des Unternehmenskontos — neueste zuerst.</p>
                    </div>
                    <div className="table-wrap">
                      {!dashboard?.company ? (
                        <p className="empty-state">
                          <strong>Keine Buchungen.</strong>
                          Starten Sie ein Spiel, um Finanzbewegungen zu sehen.
                        </p>
                      ) : (
                        <DataTable
                          searchable
                          searchPlaceholder="Buchungen suchen…"
                          columns={[
                            { key: 'transactionType', label: 'Typ' },
                            { key: 'amount', label: 'Betrag', numeric: true },
                            { key: 'balanceAfter', label: 'Saldo', numeric: true },
                            { key: 'timestamp', label: 'Zeit', numeric: true },
                          ]}
                          rows={dashboard.financeTransactions.map((transaction) => ({
                            transactionType: formatTransactionType(transaction.transactionType),
                            amount: formatTransactionAmount(
                              transaction.direction,
                              transaction.amount,
                            ),
                            balanceAfter: transaction.balanceAfter.toLocaleString('de-DE'),
                            timestamp: String(transaction.timestamp),
                          }))}
                          rowKeys={dashboard.financeTransactions.map(
                            (transaction) => `transaction:${transaction.id}`,
                          )}
                          selectedRowKey={selectedRowKey}
                          onRowSelect={(rowKey) => {
                            selectDetail('transaction', rowKey.slice('transaction:'.length));
                          }}
                          emptyText="Noch keine Buchungen."
                          emptyHint="Bauen, handeln oder forschen, um Buchungen zu erzeugen."
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
                            searchable
                            searchPlaceholder="Inventar suchen…"
                            columns={[
                              { key: 'resourceId', label: 'Ressource' },
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
                          <>
                            <DataTable
                              searchable
                              searchPlaceholder="Lagerhäuser suchen…"
                              columns={[
                                { key: 'buildingName', label: 'Lagerhaus' },
                                { key: 'resourceLines', label: 'Zeilen', numeric: true },
                                { key: 'totalUnits', label: 'Einheiten', numeric: true },
                              ]}
                              rows={(dashboard.warehouseStorage ?? []).map((storage) => ({
                                buildingName: storage.buildingName,
                                resourceLines: storage.items.length,
                                totalUnits: storage.items.reduce(
                                  (total, item) => total + item.quantity,
                                  0,
                                ),
                              }))}
                              rowKeys={(dashboard.warehouseStorage ?? []).map(
                                (storage) => `warehouse:${storage.buildingId}`,
                              )}
                              selectedRowKey={selectedRowKey}
                              onRowSelect={(rowKey) => {
                                selectDetail('warehouse', rowKey.slice('warehouse:'.length));
                              }}
                              emptyText="Kein Lagerhaus aktiv."
                              emptyHint="Schalten Sie das Lagerhaus-Meilenstein frei und bauen Sie es."
                            />
                            {(dashboard.warehouseStorage ?? []).map((storage) => (
                              <div key={storage.buildingId} className="warehouse-block">
                                <h3 className="warehouse-name">{storage.buildingName}</h3>
                                <DataTable
                                  searchable
                                  searchPlaceholder="Lager suchen…"
                                  columns={[
                                    { key: 'resourceId', label: 'Ressource' },
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
                            ))}
                          </>
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
              onSelectFinance={selectFinanceDetail}
              onSelectLogistics={selectLogisticsDetail}
              labelBuilding={labelBuilding}
              labelRecipe={labelRecipe}
              labelResource={labelResource}
              labelTechnology={labelTechnology}
              labelEmployee={labelEmployee}
              renderMarketTable={
                <MarketPricesTable
                  marketPrices={dashboard?.marketPrices ?? []}
                  labelResource={labelResource}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
