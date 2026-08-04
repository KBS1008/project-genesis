'use client';

import { useCallback, useEffect, useState } from 'react';
import { callApi } from '@/presentation/adapters/api/client';
import {
  buildOperationsKpiCards,
  buildOperationsOverviewCards,
} from '@/presentation/adapters/mappers/company-operations-view-mappers';
import type { SidebarHintsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGLoadingOverlay } from '@/presentation/components/foundation/PGLoadingOverlay';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { useTheme } from '@/presentation/theme';
import {
  CompanyDetailPanel,
  normalizeDetailSelection,
  type DetailSelection,
} from '@/presentation/screens/company/CompanyDetailPanel';
import { OperationsKpiStrip } from '@/presentation/screens/company/OperationsKpiStrip';
import { OperationsLogisticsBanner } from '@/presentation/screens/company/OperationsLogisticsBanner';
import { OperationsOverviewStrip } from '@/presentation/screens/company/OperationsOverviewStrip';
import { CompanyOperationsPanels } from '@/presentation/screens/company/CompanyOperationsPanels';
import { CompanyOperationsCharts } from '@/presentation/screens/company/CompanyOperationsCharts';
import { TutorialPanel } from '@/components/TutorialPanel';

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

function SidebarActions({
  hasGame,
  hints,
  runAction,
}: {
  readonly hasGame: boolean;
  readonly hints: SidebarHintsViewData;
  readonly runAction: (action: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
  return (
    <>
      <p className="sidebar-title">Aktionen</p>

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
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailSelection, setDetailSelection] = useState<DetailSelection>({ kind: 'overview' });

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

  const { hasGame } = companyViewData;

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

  const operationsKpiCards =
    companyViewData.kpis !== null ? buildOperationsKpiCards(companyViewData.kpis) : null;
  const operationsOverviewCards =
    companyViewData.overview !== null
      ? buildOperationsOverviewCards(companyViewData.overview)
      : null;

  return (
    <div className={`layout${isBusy ? ' is-busy' : ''}`}>
      <PGLoadingOverlay active={isBusy} />

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
              <span className="meta-pill pg-meta-pill-warning" title="Energiedefizit">
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
          {companyViewData.energyHasDeficit ? (
            <span className="meta-pill pg-meta-pill-warning" title="Energiedefizit">
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
            runAction={runAction}
          />
        </aside>

        <div className="dashboard-content">
          {hasGame && operationsKpiCards !== null ? (
            <OperationsKpiStrip
              cards={operationsKpiCards}
              onSelectFinance={selectFinanceDetail}
              onSelectLogistics={selectLogisticsDetail}
            />
          ) : null}

          <OperationsLogisticsBanner
            message={companyViewData.logisticsStatusMessage}
            onSelectLogistics={selectLogisticsDetail}
          />

          {hasGame && operationsOverviewCards !== null ? (
            <OperationsOverviewStrip
              cards={operationsOverviewCards}
              onSelectLogistics={selectLogisticsDetail}
            />
          ) : null}

          {hasGame ? <TutorialPanel tutorial={companyViewData.tutorial} /> : null}

          <CompanyOperationsCharts companyViewData={companyViewData} hasGame={hasGame} />

          <div className="dashboard-panels">
            <CompanyOperationsPanels
              companyViewData={companyViewData}
              hasGame={hasGame}
              isLoading={isLoading}
              selection={detailSelection}
              onSelectDetail={selectDetail}
            />

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
