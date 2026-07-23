'use client';

import type { ReactNode } from 'react';
import { DialogHost } from '@/presentation/dialog/DialogHost';
import { DialogProvider } from '@/presentation/dialog/DialogProvider';
import { PrimaryNavigation } from '@/presentation/navigation/PrimaryNavigation';
import { labelPrimaryScreen } from '@/presentation/navigation/PrimaryNavigation';
import { LoadingState } from '@/presentation/primitives/LoadingState';
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
  const { navigation, viewData, companyViewData, isLiveConnected } = useGameWorkspace();
  const screenLabel = labelPrimaryScreen(navigation.screen);
  const { session, simulation } = viewData;
  const availableCashLabel = companyViewData.kpis?.availableCashLabel ?? null;

  return (
    <header className="pg-workspace-header">
      <div className="pg-workspace-title-block">
        <p className="pg-workspace-eyebrow">Project Genesis · {screenLabel}</p>
        <h1>{session.companyName ?? 'Project Genesis'}</h1>
        <p className="pg-workspace-subtitle">
          {session.hasGame
            ? `Tick ${simulation.tickNumber ?? '—'} · Simulationszeit ${simulation.simulationTime ?? '—'}`
            : 'Starten Sie eine Session über das Unternehmens-Dashboard.'}
        </p>
      </div>
      <div className="pg-workspace-meta">
        {isLiveConnected ? <span className="pg-workspace-pill pg-workspace-pill-live">Live</span> : null}
        {availableCashLabel !== null ? (
          <span className="pg-workspace-pill">Verfügbar: {availableCashLabel}</span>
        ) : null}
        <span className="pg-workspace-pill">{simulation.speedLabel}</span>
      </div>
    </header>
  );
}

/** Game workspace layout with header, navigation, and dialog layer. */
export function GameWorkspaceShell({ children }: { readonly children: ReactNode }) {
  const { isLoading } = useGameWorkspace();

  return (
    <DialogProvider>
      <div className="pg-workspace">
        <WorkspaceHeader />
        <PrimaryNavigation />
        <EntitySelectionBanner />
        <main className="pg-workspace-screen" id="game-workspace-main">
          {isLoading ? <LoadingState label="Session wird geladen…" /> : children}
        </main>
        <DialogHost />
      </div>
    </DialogProvider>
  );
}
