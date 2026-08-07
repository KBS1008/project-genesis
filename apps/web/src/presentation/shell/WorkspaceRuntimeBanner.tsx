'use client';

import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';

/** Surfaces reconnecting, stale-data and recoverable runtime errors without clearing ViewData. */
export function WorkspaceRuntimeBanner() {
  const { runtimeState, recoverableError, retryRuntimeRecovery } = useGameWorkspace();

  if (runtimeState.phase === 'reconnecting') {
    return (
      <StatusBanner
        tone="warning"
        message="Verbindung verloren — Daten bleiben sichtbar, Wiederherstellung läuft…"
      />
    );
  }

  if (runtimeState.phase === 'recoverable-error' && recoverableError !== null) {
    return (
      <div className="pg-runtime-recoverable-banner">
        <StatusBanner tone="error" message={recoverableError} />
        <button type="button" onClick={() => void retryRuntimeRecovery()}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (runtimeState.phase === 'stale') {
    return (
      <StatusBanner
        tone="warning"
        message="Angezeigte Daten können veraltet sein. Live-Verbindung wird wiederhergestellt."
      />
    );
  }

  return null;
}
