'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PrimaryNavigation } from '@/presentation/navigation/PrimaryNavigation';
import { labelPrimaryScreen } from '@/presentation/navigation/PrimaryNavigation';
import { Button } from '@/presentation/primitives/Button';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { useDialog } from '@/presentation/dialog/DialogProvider';
import { useNotifications } from '@/presentation/notifications/NotificationProvider';
import { SaveGameDialog } from '@/presentation/screens/menu/SaveGameDialog';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

function EntitySelectionBanner() {
  const { navigation, clearEntitySelection } = useGameWorkspace();

  if (navigation.entitySelection.kind === 'none') {
    return null;
  }

  return (
    <div className="pg-selection-banner" role="status">
      <span>
        Auswahl: {navigation.entitySelection.kind} · {navigation.entitySelection.id}
      </span>
      <button type="button" onClick={clearEntitySelection}>
        Auswahl aufheben
      </button>
    </div>
  );
}

function WorkspaceHeader() {
  const router = useRouter();
  const { openConfirmDialog } = useDialog();
  const { showNotification } = useNotifications();
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
              ? `Tick ${simulation.tickNumber ?? '—'} · Simulationszeit ${simulation.simulationTime ?? '—'}`
              : 'Keine aktive Session — kehren Sie zum Hauptmenü zurück.'}
          </p>
        </div>
        <div className="pg-workspace-meta">
          {isLiveConnected ? <span className="pg-workspace-pill pg-workspace-pill-live">Live</span> : null}
          {isSessionDirty ? <span className="pg-workspace-pill">Ungespeichert</span> : null}
          {availableCashLabel !== null ? (
            <span className="pg-workspace-pill">Verfügbar: {availableCashLabel}</span>
          ) : null}
          <span className="pg-workspace-pill">{simulation.speedLabel}</span>
          <div className="pg-workspace-toolbar">
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

/** Game workspace layout with header, navigation, and session actions. */
export function GameWorkspaceShell({ children }: { readonly children: ReactNode }) {
  const { isLoading } = useGameWorkspace();

  return (
    <div className="pg-workspace">
      <WorkspaceHeader />
      <PrimaryNavigation />
      <EntitySelectionBanner />
      <main className="pg-workspace-screen" id="game-workspace-main">
        {isLoading ? <LoadingState label="Session wird geladen…" /> : children}
      </main>
    </div>
  );
}
