'use client';

import { useCallback, useEffect, useState } from 'react';
import { callApi } from '@/presentation/adapters/api/client';
import type {
  BuildingRowViewData,
  KpiStripViewData,
  OverviewStripViewData,
  SidebarHintsViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { formatProgress } from '@/presentation/formatting/presentation-formatters';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import {
  CompanyDetailPanel,
  normalizeDetailSelection,
  type DetailSelection,
} from '@/presentation/screens/company/CompanyDetailPanel';
import { TickHistoryCharts } from '@/components/TickHistoryCharts';
import { InventoryHistoryChart } from '@/components/InventoryHistoryChart';
import { MarketPriceHistoryChart } from '@/components/MarketPriceHistoryChart';
import { MarketSupplyDemandChart } from '@/components/MarketSupplyDemandChart';
import { MarketPressureHistoryChart } from '@/components/MarketPressureHistoryChart';
import { PriceIndexHistoryChart } from '@/components/PriceIndexHistoryChart';
import { MarketPricesTable } from '@/components/MarketPricesTable';
import { EnergyHistoryChart } from '@/components/EnergyHistoryChart';
import { DataTable } from '@/components/DataTable';
import { TutorialPanel } from '@/components/TutorialPanel';
import { DashboardIcon } from '@/components/icons/DashboardIcons';

function KpiStrip({
  kpis,
  onSelectFinance,
  onSelectLogistics,
}: {
  readonly kpis: KpiStripViewData;
  readonly onSelectFinance: () => void;
  readonly onSelectLogistics: () => void;
}) {
  return (
    <section className="kpi-strip" aria-label="Kennzahlen">
      <button type="button" className="kpi-card kpi-card-button" onClick={onSelectFinance}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="cash" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Verfügbar</span>
          <strong className="kpi-value">{kpis.availableCashLabel}</strong>
          <span className="kpi-trend">{kpis.availableCashTrend}</span>
        </div>
      </button>
      <article className={`kpi-card${kpis.energyHasDeficit ? ' kpi-warning' : ''}`}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="energy" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Energie-Reserve</span>
          <strong className="kpi-value">{kpis.energyReserveLabel}</strong>
          <span className="kpi-trend">{kpis.energyTrend}</span>
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
          <span className="kpi-trend">{kpis.activeTransportTrend}</span>
        </div>
      </button>
      <button type="button" className="kpi-card kpi-card-button" onClick={onSelectLogistics}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="warehouse" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Im Lagerhaus</span>
          <strong className="kpi-value">{kpis.warehouseTotalUnits}</strong>
          <span className="kpi-trend">{kpis.warehouseCapacityHint}</span>
        </div>
      </button>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="onsite" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Am Standort</span>
          <strong className="kpi-value">{kpis.onSiteResourceLines}</strong>
          <span className="kpi-trend">{kpis.onSiteHint}</span>
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
          <span className="kpi-trend">{kpis.payrollLabel}</span>
        </div>
      </article>
      <article className="kpi-card">
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="info" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Preisindex</span>
          <strong className="kpi-value">{kpis.priceIndexLabel}</strong>
          <span className="kpi-trend">{kpis.priceIndexHint}</span>
        </div>
      </article>
      <article className={`kpi-card${kpis.taxPaymentBlocked ? ' kpi-warning' : ''}`}>
        <span className="kpi-icon" aria-hidden="true">
          <DashboardIcon name="cash" className="dashboard-icon" />
        </span>
        <div className="kpi-body">
          <span className="kpi-label">Steuer / Verträge</span>
          <strong className="kpi-value">{kpis.corporateTaxRateLabel}</strong>
          <span className="kpi-trend">{kpis.taxTrendLabel}</span>
        </div>
      </article>
    </section>
  );
}

function OverviewStrip({
  overview,
  onSelectLogistics,
}: {
  readonly overview: OverviewStripViewData;
  readonly onSelectLogistics: () => void;
}) {
  return (
    <section className="overview-strip" aria-label="Überblick">
      {overview.cards.map((card) => {
        const content = (
          <>
            <span className="overview-label">{card.label}</span>
            <strong className="overview-value">{card.value}</strong>
            <span className="overview-hint">{card.hint}</span>
          </>
        );

        if (card.label === 'Transport') {
          return (
            <button
              key={card.label}
              type="button"
              className="overview-card overview-card-button"
              onClick={onSelectLogistics}
            >
              {content}
            </button>
          );
        }

        return (
          <article key={card.label} className="overview-card">
            {content}
          </article>
        );
      })}
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
    <button
      type="button"
      className="logistics-banner logistics-banner-button"
      onClick={onSelectLogistics}
    >
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

function ConstructionStatus({ building }: { readonly building: BuildingRowViewData }) {
  if (!building.isUnderConstruction) {
    return <>{building.statusLabel}</>;
  }

  return (
    <div className="progress-cell">
      <span>{building.statusLabel}</span>
      <div className="progress-bar" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${Math.round(building.constructionProgressPercent)}%` }}
        />
      </div>
      <span className="progress-label">{formatProgress(building.constructionProgressPercent)}</span>
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
  readonly hints: SidebarHintsViewData;
  readonly buildingCount: number;
  readonly runAction: (action: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
  return (
    <>
      <p className="sidebar-title">Aktionen</p>

      <div className="toolbar-group">
        <span className="toolbar-label">Bauen</span>
        {hints.placeBuilding.length === 0 ? (
          <p className="empty-state">Keine Bauoptionen verfügbar.</p>
        ) : (
          hints.placeBuilding.map((hint) => (
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
        {hints.production.length === 0 ? (
          <p className="empty-state">Keine Produktionsaktionen möglich.</p>
        ) : (
          hints.production.map((hint) => (
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
        {hints.market.length === 0 ? (
          <p className="empty-state">Keine Marktaktionen verfügbar.</p>
        ) : (
          hints.market.flatMap((hint) => [
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
        {hints.research.length === 0 ? (
          <p className="empty-state">Keine Forschungsprojekte startbar.</p>
        ) : (
          hints.research.map((hint) => (
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
        {hints.hireEmployee.length === 0 ? (
          <p className="empty-state">Keine Einstellungsoptionen verfügbar.</p>
        ) : (
          hints.hireEmployee.map((hint) => (
            <HintButton
              key={hint.employeeTypeId}
              label={`${hint.name} (${hint.costLabel})`}
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
        {hints.assignEmployee.filter((hint) => hint.canAssign).length === 0 ? (
          <p className="empty-state">Keine Zuweisungen möglich.</p>
        ) : (
          hints.assignEmployee
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

/** Company dashboard screen consuming workspace view-data. */
export function CompanyDashboardScreen({
  hideHeader = false,
  onBackToOverview,
}: {
  readonly hideHeader?: boolean;
  readonly onBackToOverview?: () => void;
}) {
  const { companyViewData, isLoading, isBusy, isLiveConnected, runCommand, navigation } =
    useGameWorkspace();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailSelection, setDetailSelection] = useState<DetailSelection>({ kind: 'overview' });

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
    setDetailSelection((current) =>
      normalizeDetailSelection(
        companyViewData.entityCatalog,
        companyViewData.hasGame,
        companyViewData.detail.hasFinance,
        companyViewData.detail.hasLogistics,
        current,
      ),
    );
  }, [companyViewData]);

  useEffect(() => {
    const selection = navigation.entitySelection;

    if (selection.kind === 'building') {
      setDetailSelection({ kind: 'building', id: selection.id });
      return;
    }

    if (selection.kind === 'production') {
      setDetailSelection({ kind: 'production', id: selection.id });
      return;
    }

    if (selection.kind === 'transport') {
      setDetailSelection({ kind: 'transport', id: selection.id });
      return;
    }

    if (selection.kind === 'research') {
      setDetailSelection({ kind: 'research', id: selection.id });
      return;
    }

    if (selection.kind === 'employee') {
      setDetailSelection({ kind: 'employee', id: selection.id });
    }
  }, [navigation.entitySelection]);

  const runAction = useCallback(
    async (action: () => Promise<void>, successMessage: string) => {
      await runCommand(action, successMessage);
      setSidebarOpen(false);
    },
    [runCommand],
  );

  const { hasGame, labels } = companyViewData;
  const marketPricesForTable = companyViewData.marketPrices.map((price) => ({
    resourceId: price.resourceId,
    basePrice: price.basePrice,
    lastPrice: price.lastPrice,
    tradeVolume: 0,
    updatedAt: 0,
    totalSupply: price.totalSupply,
    baselineDemand: price.baselineDemand,
    pressureIndex: price.pressureIndex,
    changeFromBase: 0,
    changePercent: 0,
    trend: price.trend,
  }));

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

      {hideHeader ? null : (
        <header className="header">
          <div>
            <p className="eyebrow">Deterministic Economy Simulation</p>
            <h1>{companyViewData.companyName ?? 'Project Genesis'}</h1>
            <p className="header-subtitle">{companyViewData.headerSubtitle}</p>
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
            {companyViewData.energyHasDeficit ? (
              <span
                className="meta-pill"
                style={{ color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.45)' }}
              >
                Energie-Defizit
              </span>
            ) : null}
          </div>
        </header>
      )}

      {hideHeader ? (
        <div className="header-actions workspace-toolbar">
          {onBackToOverview ? (
            <button type="button" className="btn-secondary" onClick={onBackToOverview}>
              Zur Übersicht
            </button>
          ) : null}
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
          {companyViewData.energyHasDeficit ? (
            <span
              className="meta-pill"
              style={{ color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.45)' }}
            >
              Energie-Defizit
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={`dashboard-body${hideHeader ? ' dashboard-body-embedded' : ''}`}>
        <aside
          id="dashboard-sidebar"
          className={`dashboard-sidebar${sidebarOpen ? ' is-open' : ''}`}
          aria-label="Dashboard-Aktionen"
        >
          <SidebarActions
            hasGame={hasGame}
            hints={companyViewData.hints}
            buildingCount={companyViewData.buildingCount}
            runAction={runAction}
          />
        </aside>

        <div className="dashboard-content">
          {hasGame && companyViewData.kpis ? (
            <KpiStrip
              kpis={companyViewData.kpis}
              onSelectFinance={selectFinanceDetail}
              onSelectLogistics={selectLogisticsDetail}
            />
          ) : null}

          <div className="status-bar">
            <LogisticsBanner
              message={companyViewData.logisticsStatusMessage}
              onSelectLogistics={selectLogisticsDetail}
            />
          </div>

          {hasGame && companyViewData.overview ? (
            <OverviewStrip
              overview={companyViewData.overview}
              onSelectLogistics={selectLogisticsDetail}
            />
          ) : null}

          {hasGame ? <TutorialPanel tutorial={companyViewData.tutorial} /> : null}

          {hasGame ? <TickHistoryCharts points={companyViewData.chartPoints} /> : null}

          {hasGame ? <InventoryHistoryChart points={companyViewData.chartPoints} /> : null}

          {hasGame ? <EnergyHistoryChart points={companyViewData.chartPoints} /> : null}

          {hasGame ? (
            <MarketPriceHistoryChart points={companyViewData.chartPoints} labelResource={labels.resource} />
          ) : null}

          {hasGame ? (
            <MarketSupplyDemandChart
              marketPrices={marketPricesForTable}
              labelResource={labels.resource}
            />
          ) : null}

          {hasGame ? (
            <MarketPressureHistoryChart points={companyViewData.chartPoints} labelResource={labels.resource} />
          ) : null}

          {hasGame ? <PriceIndexHistoryChart points={companyViewData.chartPoints} /> : null}

          <div className="dashboard-panels">
            <div className="dashboard-tables">
              {isLoading ? (
                <>
                  <section className="card card-loading">
                    <div className="skeleton-block" style={{ width: '40%' }} />
                    <div
                      className="skeleton-block"
                      style={{ width: '70%', marginTop: '0.75rem' }}
                    />
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
                      {!hasGame ? (
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
                          rows={companyViewData.buildings.map((building) => ({
                            name: building.name,
                            buildingTypeId: building.buildingTypeLabel,
                            status: building.statusLabel,
                            position: building.positionLabel,
                          }))}
                          rowKeys={companyViewData.buildings.map((building) => `building:${building.id}`)}
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

                            const building = companyViewData.buildings.find(
                              (entry) => entry.name === row.name && entry.statusLabel === row.status,
                            );

                            return building ? (
                              <ConstructionStatus building={building} />
                            ) : (
                              row.status
                            );
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
                      {!hasGame ? (
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
                          rows={companyViewData.employees.map((employee) => ({
                            displayName: employee.displayName,
                            employeeTypeId: employee.employeeTypeLabel,
                            salary: employee.salaryLabel,
                            productivity: employee.productivityLabel,
                            assignment: employee.assignmentLabel,
                          }))}
                          rowKeys={companyViewData.employees.map((employee) => `employee:${employee.id}`)}
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

                  <section
                    className={`card${companyViewData.economy?.taxPaymentBlocked ? ' card-warning' : ''}`}
                  >
                    <div className="section-header">
                      <h2>Wirtschaft</h2>
                      <p>
                        Unternehmenssteuer {companyViewData.economy?.corporateTaxRateLabel ?? '5 %'} alle{' '}
                        {companyViewData.economy?.taxIntervalTicks ?? 30} Ticks · Preisindex{' '}
                        {companyViewData.economy?.priceIndexLabel ?? '1,00'} (neutral 1,00). Lieferverträge
                        entnehmen Ressourcen nur aus dem Standort-Inventar, nicht aus Lagerhaus-Beständen.
                      </p>
                    </div>
                    {companyViewData.economy?.taxPaymentBlocked &&
                    companyViewData.economy.pendingTaxLabel ? (
                      <p className="empty-state kv-value-warning" role="status">
                        <strong>Steuer offen:</strong> {companyViewData.economy.pendingTaxLabel} fällig, aber
                        die Kasse reicht nicht — die Abbuchung wird übersprungen, bis genug Cash vorhanden
                        ist.
                      </p>
                    ) : null}
                    <div className="table-wrap">
                      {!hasGame || (companyViewData.economy?.contracts.length ?? 0) === 0 ? (
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
                          rows={(companyViewData.economy?.contracts ?? []).map((contract) => ({
                            resourceId: contract.resourceLabel,
                            amount: contract.amount,
                            paymentAmount: contract.paymentLabel,
                            intervalTicks: contract.intervalLabel,
                            status: contract.statusLabel,
                          }))}
                          rowKeys={(companyViewData.economy?.contracts ?? []).map(
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
                      <p>
                        Preise, Angebot, Nachfrage und Trend je Ressource. Handelsgebühr: 2&nbsp;%
                        (min. 1 GC) pro Transaktion.
                      </p>
                    </div>
                    <div className="table-wrap">
                      {!hasGame ? (
                        <p className="empty-state">
                          <strong>Noch keine Marktdaten.</strong>
                          Starten Sie ein Spiel, um dynamische Preise zu sehen.
                        </p>
                      ) : (
                        <MarketPricesTable
                          marketPrices={marketPricesForTable}
                          labelResource={labels.resource}
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
                        {!hasGame ? (
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
                            rows={companyViewData.productionJobs.map((job) => ({
                              recipeId: job.recipeLabel,
                              buildingId: job.buildingLabel,
                              status: job.statusLabel,
                              progress: job.progressLabel,
                            }))}
                            rowKeys={companyViewData.productionJobs.map((job) => `production:${job.id}`)}
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
                        {!hasGame ? (
                          <p className="empty-state">
                            <strong>Keine laufende Forschung.</strong>
                            Starten Sie ein Projekt in der Seitenleiste.
                          </p>
                        ) : (
                          <>
                            {companyViewData.completedResearchLabels.length > 0 ? (
                              <p className="research-done">
                                Abgeschlossen: {companyViewData.completedResearchLabels.join(', ')}
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
                              rows={companyViewData.researchJobs.map((job) => ({
                                technologyId: job.technologyLabel,
                                status: job.statusLabel,
                                progress: job.progressLabel,
                              }))}
                              rowKeys={companyViewData.researchJobs.map((job) => `research:${job.id}`)}
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
                        Interner Transport vom Lagerhaus zum Produktionsgebäude (Dauer aus Routen-Content).
                        Produktion startet nach Ankunft aller Lieferungen.
                      </p>
                    </div>
                    <div className="table-wrap">
                      {!hasGame ? (
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
                          rows={companyViewData.transportOrders.map((order) => ({
                            resourceId: order.resourceLabel,
                            amount: order.amountLabel,
                            route: order.routeLabel,
                            recipeName: order.recipeLabel,
                            status: order.statusLabel,
                            durationTicks: order.durationLabel,
                            progress: order.progressLabel,
                          }))}
                          rowKeys={companyViewData.transportOrders.map((order) => `transport:${order.id}`)}
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
                      {!hasGame ? (
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
                          rows={companyViewData.financeTransactions.map((transaction) => ({
                            transactionType: transaction.typeLabel,
                            amount: transaction.amountLabel,
                            balanceAfter: transaction.balanceLabel,
                            timestamp: transaction.timestampLabel,
                          }))}
                          rowKeys={companyViewData.financeTransactions.map(
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
                        <p>
                          Material direkt an Produktionsgebäuden — bereit für sofortige Nutzung.
                        </p>
                      </div>
                      <div className="table-wrap">
                        {companyViewData.inventoryItems.length === 0 ? (
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
                            rows={companyViewData.inventoryItems.map((item) => ({
                              resourceId: item.resourceLabel,
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
                        <p>
                          Marktkäufe landen hier. Transport bringt Material zum Produktionsstandort.
                        </p>
                      </div>
                      <div className="table-wrap">
                        {!hasGame ? (
                          <p className="empty-state">
                            <strong>Kein Lagerhaus aktiv.</strong>
                            Bauen Sie ein Lagerhaus, um Marktkäufe zu lagern.
                          </p>
                        ) : companyViewData.warehouseStorage.length === 0 ? (
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
                              rows={companyViewData.warehouseStorage.map((storage) => ({
                                buildingName: storage.buildingLabel,
                                resourceLines: storage.items.length,
                                totalUnits: storage.items.reduce(
                                  (total, item) => total + item.quantity,
                                  0,
                                ),
                              }))}
                              rowKeys={companyViewData.warehouseStorage.map(
                                (storage) => `warehouse:${storage.id}`,
                              )}
                              selectedRowKey={selectedRowKey}
                              onRowSelect={(rowKey) => {
                                selectDetail('warehouse', rowKey.slice('warehouse:'.length));
                              }}
                              emptyText="Kein Lagerhaus aktiv."
                              emptyHint="Schalten Sie das Lagerhaus-Meilenstein frei und bauen Sie es."
                            />
                            {companyViewData.warehouseStorage.map((storage) => (
                              <div key={storage.id} className="warehouse-block">
                                <h3 className="warehouse-name">{storage.buildingLabel}</h3>
                                <DataTable
                                  searchable
                                  searchPlaceholder="Lager suchen…"
                                  columns={[
                                    { key: 'resourceId', label: 'Ressource' },
                                    { key: 'reserved', label: 'Reserviert', numeric: true },
                                    { key: 'available', label: 'Verfügbar', numeric: true },
                                  ]}
                                  rows={storage.items.map((item) => ({
                                    resourceId: item.resourceLabel,
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

            <CompanyDetailPanel
              detail={companyViewData.detail}
              marketPrices={companyViewData.marketPrices}
              selection={detailSelection}
              onClearSelection={clearDetailSelection}
              onSelectFinance={selectFinanceDetail}
              onSelectLogistics={selectLogisticsDetail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
