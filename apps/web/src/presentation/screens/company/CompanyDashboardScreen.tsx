'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  buildOperationsKpiCards,
  buildOperationsOverviewCards,
} from '@/presentation/adapters/mappers/company-operations-view-mappers';
import { PGLoadingOverlay } from '@/presentation/components/foundation/PGLoadingOverlay';
import { PGTutorialPanel } from '@/presentation/components/dashboard/PGTutorialPanel';
import { Button } from '@/presentation/primitives/Button';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { useTheme } from '@/presentation/theme';
import {
  normalizeDetailSelection,
  type DetailSelection,
} from '@/presentation/screens/company/company-detail-selection';
import { OperationsKpiStrip } from '@/presentation/screens/company/OperationsKpiStrip';
import { OperationsLogisticsBanner } from '@/presentation/screens/company/OperationsLogisticsBanner';
import { OperationsOverviewStrip } from '@/presentation/screens/company/OperationsOverviewStrip';
import { CompanyOperationsPanels } from '@/presentation/screens/company/CompanyOperationsPanels';
import { CompanyOperationsCharts } from '@/presentation/screens/company/CompanyOperationsCharts';
import { CompanyOperationsInspector } from '@/presentation/screens/company/CompanyOperationsInspector';
import { PGOperationsSidebar } from '@/presentation/screens/company/PGOperationsSidebar';
import type { CommandId } from '@/presentation/commands';

/** Company dashboard screen consuming workspace view-data. */
export function CompanyDashboardScreen({
  hideHeader = false,
  onBackToOverview,
}: {
  readonly hideHeader?: boolean;
  readonly onBackToOverview?: () => void;
}) {
  const { companyViewData, isLoading, isBusy, isLiveConnected, runCommand, navigation, selectEntity, clearEntitySelection } =
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
    async (
      action: () => Promise<void>,
      successMessage: string,
      commandId: CommandId,
      options?: { readonly clearsDirty?: boolean },
    ) => {
      await runCommand(action, successMessage, { commandId, ...options });
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

      if (
        kind === 'building' ||
        kind === 'production' ||
        kind === 'transport' ||
        kind === 'research' ||
        kind === 'employee'
      ) {
        selectEntity({ kind, id });
        return;
      }

      clearEntitySelection();
    },
    [selectEntity, clearEntitySelection],
  );

  const selectFinanceDetail = useCallback(() => {
    setDetailSelection({ kind: 'finance' });
    clearEntitySelection();
  }, [clearEntitySelection]);

  const selectLogisticsDetail = useCallback(() => {
    setDetailSelection({ kind: 'logistics' });
    clearEntitySelection();
  }, [clearEntitySelection]);

  const clearDetailSelection = useCallback(() => {
    setDetailSelection({ kind: 'overview' });
    clearEntitySelection();
  }, [clearEntitySelection]);

  const operationsKpiCards =
    companyViewData.kpis !== null ? buildOperationsKpiCards(companyViewData.kpis) : null;
  const operationsOverviewCards =
    companyViewData.overview !== null
      ? buildOperationsOverviewCards(companyViewData.overview)
      : null;

  return (
    <div className={`pg-operations-layout${isBusy ? ' is-busy' : ''}`}>
      <PGLoadingOverlay active={isBusy} />

      {sidebarOpen ? (
        <button
          type="button"
          className="pg-operations-sidebar-backdrop"
          aria-label="Seitenleiste schließen"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {hideHeader ? null : (
        <header className="pg-operations-header">
          <div className="pg-operations-header-copy">
            <p className="pg-workspace-subtitle">Deterministic Economy Simulation</p>
            <h1>{companyViewData.companyName ?? 'Project Genesis'}</h1>
            <p className="pg-operations-header-subtitle">{companyViewData.headerSubtitle}</p>
          </div>
          <div className="pg-operations-header-actions">
            <Button
              variant="secondary"
              className="pg-operations-mobile-only"
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              Aktionen
            </Button>
            <Button
              variant="secondary"
              aria-label={theme === 'light' ? 'Dark Mode aktivieren' : 'Light Mode aktivieren'}
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            {isLiveConnected ? (
              <span className="pg-meta-pill pg-meta-pill-live" title="Live-Updates aktiv">
                Live
              </span>
            ) : null}
            {companyViewData.energyHasDeficit ? (
              <span className="pg-meta-pill pg-meta-pill-warning" title="Energiedefizit">
                Energie-Defizit
              </span>
            ) : null}
          </div>
        </header>
      )}

      {hideHeader ? (
        <div className="pg-operations-toolbar">
          {onBackToOverview ? (
            <Button variant="secondary" onClick={onBackToOverview}>
              Zur Übersicht
            </Button>
          ) : null}
          <Button
            variant="secondary"
            className="pg-operations-mobile-only"
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-sidebar"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            Aktionen
          </Button>
          {companyViewData.energyHasDeficit ? (
            <span className="pg-meta-pill pg-meta-pill-warning" title="Energiedefizit">
              Energie-Defizit
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={`pg-operations-body${hideHeader ? ' pg-operations-body-embedded' : ''}`}>
        <aside
          id="dashboard-sidebar"
          className={`pg-operations-sidebar${sidebarOpen ? ' is-open' : ''}`}
          aria-label="Dashboard-Aktionen"
        >
          <PGOperationsSidebar hasGame={hasGame} hints={companyViewData.hints} runAction={runAction} />
        </aside>

        <div className="pg-operations-content">
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

          {hasGame ? <PGTutorialPanel tutorial={companyViewData.tutorial} /> : null}

          <CompanyOperationsCharts companyViewData={companyViewData} hasGame={hasGame} />

          <div className="pg-operations-panels-layout">
            <CompanyOperationsPanels
              companyViewData={companyViewData}
              hasGame={hasGame}
              isLoading={isLoading}
              selection={detailSelection}
              onSelectDetail={selectDetail}
            />

            <CompanyOperationsInspector
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
