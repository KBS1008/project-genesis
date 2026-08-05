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
import { useNotifications } from '@/presentation/notifications/NotificationProvider';
import { formatSimulationTime, formatTick } from '@/presentation/formatting/presentation-formatters';
import { NotificationIndicator } from '@/presentation/shell/NotificationIndicator';
import { SaveGameDialog } from '@/presentation/screens/menu/SaveGameDialog';
import { SimulationControlsBar } from '@/presentation/shell/SimulationControlsBar';
import { SimulationTickLoop } from '@/presentation/simulation';
import { useTheme } from '@/presentation/theme';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { formatEntitySelectionLabel } from '@/presentation/navigation/entity-selection-labels';

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
  const { showNotification } = useNotifications();
  const { openSearch } = useGlobalSearch();
  const {
    navigation,
    viewData,
    companyViewData,
    isLiveConnected,
    isSessionDirty,
    markSessionSaved,
    refreshSession,
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
            void refreshSession();
            showNotification({ tone: 'success', message: 'Spielstand gespeichert.' });
          }}
        />
      ) : null}
    </>
  );
}

function WorkspaceStatusBar() {
  const { viewData, companyViewData, isLiveConnected, isSessionDirty } = useGameWorkspace();
  const { theme, toggleTheme } = useTheme();

  return (
    <PGStatusBar
      left={
        <>
          <span>{viewData.session.companyName ?? 'Keine Session'}</span>
          {isLiveConnected ? <span>Live</span> : null}
          {isSessionDirty ? <span>Ungespeichert</span> : null}
        </>
      }
      center={
        <span>
          Tick {formatTick(viewData.simulation.tickNumber)} · {formatSimulationTime(viewData.simulation.simulationTime)}
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
  const { isLoading, navigation, clearEntitySelection } = useGameWorkspace();
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
      <EntitySelectionBanner />
      <main className="pg-workspace-screen" id="game-workspace-main">
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
        </div>
      </GlobalSearchProvider>
    </ContextMenuProvider>
  );
}
