'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PGStatusBar } from '@/presentation/components/layout';
import {
  ContextMenuProvider,
  GlobalSearchProvider,
  PGSidebar,
  useContextMenu,
  useGlobalSearch,
} from '@/presentation/components/shell';
import { labelPrimaryScreen } from '@/presentation/navigation/label-primary-screen';
import { Button } from '@/presentation/primitives/Button';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { useDialog } from '@/presentation/dialog/DialogProvider';
import { formatSimulationTime, formatTick } from '@/presentation/formatting/presentation-formatters';
import { NotificationIndicator } from '@/presentation/shell/NotificationIndicator';
import { SaveGameDialog } from '@/presentation/screens/menu/SaveGameDialog';
import { SimulationControlsBar } from '@/presentation/shell/SimulationControlsBar';
import { SimulationTickLoop } from '@/presentation/simulation';
import { useTheme } from '@/presentation/theme';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { formatEntitySelectionLabel } from '@/presentation/navigation/entity-selection-labels';
import { SimulationCriticalAnnouncer } from '@/presentation/notifications/SimulationCriticalAnnouncer';
import {
  formatDashboardConnectionLabel,
  formatWorkspaceDataFreshnessLabel,
} from '@/presentation/runtime/workspace-runtime-state';
import { WorkspaceRuntimeBanner } from '@/presentation/shell/WorkspaceRuntimeBanner';

function EntitySelectionBanner() {
  const { navigation, companyViewData, regions, clearEntitySelection } = useGameWorkspace();
  const selectionLabel = formatEntitySelectionLabel(
    navigation.entitySelection,
    companyViewData,
    regions,
  );

  if (selectionLabel === null) {
    return null;
  }

  return (
    <div className="pg-selection-banner" role="status">
      <span>Auswahl: {selectionLabel}</span>
      <button type="button" aria-label="Auswahl aufheben" onClick={clearEntitySelection}>
        Auswahl aufheben
      </button>
    </div>
  );
}

function WorkspaceHeader() {
  const router = useRouter();
  const { openConfirmDialog } = useDialog();
  const { openSearch } = useGlobalSearch();
  const {
    navigation,
    viewData,
    companyViewData,
    isLiveConnected,
    isSessionDirty,
    markSessionSaved,
  } = useGameWorkspace();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const screenLabel = labelPrimaryScreen(navigation.screen);
  const { session, simulation } = viewData;
  const availableCashLabel = companyViewData.kpis?.availableCashLabel ?? null;

  const handleReturnToMenu = () => {
    const navigateHome = () => {
      router.push('/');
    };

    if (session.hasGame && isSessionDirty) {
      openConfirmDialog(
        {
          id: 'unsaved-return-menu',
          title: 'Ungespeicherter Fortschritt',
          message:
            'Es gibt Änderungen, die noch nicht gespeichert wurden. Möchten Sie das Hauptmenü trotzdem öffnen?',
          confirmLabel: 'Verlassen',
        },
        navigateHome,
      );
      return;
    }

    navigateHome();
  };

  return (
    <>
      <header className="pg-workspace-header">
        <div className="pg-workspace-title-block">
          <p className="pg-workspace-eyebrow">Project Genesis · {screenLabel}</p>
          <h1>{session.companyName ?? 'Project Genesis'}</h1>
          <p className="pg-workspace-subtitle">
            {session.hasGame
              ? `Tick ${formatTick(simulation.tickNumber)} · Simulationszeit ${formatSimulationTime(simulation.simulationTime)}`
              : 'Keine aktive Session — kehren Sie zum Hauptmenü zurück.'}
          </p>
        </div>
        <div className="pg-workspace-meta">
          {session.hasGame ? (
            <span
              className={`pg-workspace-pill${simulation.isPaused ? ' pg-workspace-pill-paused' : ' pg-workspace-pill-active'}`.trim()}
            >
              {simulation.isPaused ? 'Pausiert' : 'Session aktiv'}
            </span>
          ) : null}
          {isLiveConnected ? <span className="pg-workspace-pill pg-workspace-pill-live">Live</span> : null}
          {isSessionDirty ? <span className="pg-workspace-pill">Ungespeichert</span> : null}
          {availableCashLabel !== null ? (
            <span className="pg-workspace-pill">Verfügbar: {availableCashLabel}</span>
          ) : null}
          <span className="pg-workspace-pill">{simulation.speedLabel}</span>
          <NotificationIndicator />
          <div className="pg-workspace-toolbar">
            <Button variant="secondary" onClick={openSearch} aria-label="Globale Suche öffnen">
              Suche
            </Button>
            <Button
              variant="secondary"
              disabled={!session.hasGame}
              onClick={() => {
                setSaveDialogOpen(true);
              }}
            >
              Speichern
            </Button>
            <Button variant="secondary" onClick={handleReturnToMenu}>
              Hauptmenü
            </Button>
          </div>
        </div>
      </header>

      {saveDialogOpen ? (
        <SaveGameDialog
          defaultSavePath={session.savePath}
          onClose={() => {
            setSaveDialogOpen(false);
          }}
          onSaved={(filePath) => {
            markSessionSaved(filePath);
          }}
        />
      ) : null}
    </>
  );
}

function WorkspaceStatusBar() {
  const {
    viewData,
    companyViewData,
    connectionState,
    runtimeState,
    isSessionDirty,
  } = useGameWorkspace();
  const { theme, toggleTheme } = useTheme();
  const { session, simulation } = viewData;
  const simulationStatusLabel = simulation.isPaused
    ? 'Simulation pausiert'
    : session.hasGame
      ? 'Simulation aktiv'
      : 'Keine Session';

  return (
    <PGStatusBar
      left={
        <>
          <span aria-label="Unternehmen">{session.companyName ?? 'Keine Session'}</span>
          <span aria-label="Simulationstatus">{simulationStatusLabel}</span>
          <span aria-label="Verbindungsstatus">
            {formatDashboardConnectionLabel(connectionState)}
          </span>
          <span aria-label="Datenstatus">
            {formatWorkspaceDataFreshnessLabel(runtimeState.dataFreshness)}
          </span>
          <span aria-label="Autosave-Status">
            {isSessionDirty ? 'Ungespeichert' : 'Gespeichert'}
          </span>
        </>
      }
      center={
        <span
          aria-label={`Tick ${formatTick(simulation.tickNumber)} · Simulationszeit ${formatSimulationTime(simulation.simulationTime)} · Geschwindigkeit ${simulation.speedLabel}`}
        >
          Tick {formatTick(simulation.tickNumber)} · {formatSimulationTime(simulation.simulationTime)} ·{' '}
          {simulation.speedLabel}
        </span>
      }
      right={
        <>
          {companyViewData.kpis?.availableCashLabel !== undefined ? (
            <span>{companyViewData.kpis.availableCashLabel}</span>
          ) : null}
          <Button variant="secondary" onClick={toggleTheme} aria-label="Theme umschalten">
            {theme === 'dark' ? 'Hell' : 'Dunkel'}
          </Button>
        </>
      }
    />
  );
}

function WorkspaceMain({ children }: { readonly children: ReactNode }) {
  const { isLoading, navigation, clearEntitySelection, runtimeState } = useGameWorkspace();
  const { openSearch } = useGlobalSearch();
  const { openContextMenu } = useContextMenu();

  return (
    <div
      className="pg-application-shell-main"
      onContextMenu={(event) => {
        openContextMenu(event, [
          {
            id: 'open-search',
            label: 'Globale Suche',
            onSelect: openSearch,
          },
          {
            id: 'clear-selection',
            label: 'Auswahl aufheben',
            disabled: navigation.entitySelection.kind === 'none',
            onSelect: clearEntitySelection,
          },
        ]);
      }}
    >
      <SimulationControlsBar />
      <SimulationTickLoop />
      <WorkspaceRuntimeBanner />
      <EntitySelectionBanner />
      <main
        className="pg-workspace-screen"
        id="game-workspace-main"
        aria-busy={runtimeState.isAriaBusy}
      >
        {isLoading ? <LoadingState label="Session wird geladen…" /> : children}
      </main>
    </div>
  );
}

/** Game workspace layout with header, sidebar, and session actions. */
export function GameWorkspaceShell({ children }: { readonly children: ReactNode }) {
  return (
    <ContextMenuProvider>
      <GlobalSearchProvider>
        <div className="pg-application-shell pg-workspace">
          <a className="pg-skip-link" href="#game-workspace-main">
            Zum Inhalt springen
          </a>
          <WorkspaceHeader />
          <div className="pg-application-shell-body">
            <PGSidebar />
            <WorkspaceMain>{children}</WorkspaceMain>
          </div>
          <WorkspaceStatusBar />
          <SimulationCriticalAnnouncer />
        </div>
      </GlobalSearchProvider>
    </ContextMenuProvider>
  );
}
