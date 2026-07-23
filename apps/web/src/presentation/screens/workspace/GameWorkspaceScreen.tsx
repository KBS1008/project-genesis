'use client';

import { Suspense } from 'react';
import { ScreenRouter } from '@/presentation/navigation/ScreenRouter';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { GameWorkspaceProvider } from '@/presentation/state/GameWorkspaceProvider';
import { GameWorkspaceShell } from '@/presentation/shell/GameWorkspaceShell';

function GameWorkspaceContent() {
  return (
    <GameWorkspaceProvider>
      <GameWorkspaceShell>
        <ScreenRouter />
      </GameWorkspaceShell>
    </GameWorkspaceProvider>
  );
}

/** M9 game workspace with primary navigation and URL-backed UI state. */
export function GameWorkspaceScreen() {
  return (
    <Suspense fallback={<LoadingState label="Workspace wird geladen…" />}>
      <GameWorkspaceContent />
    </Suspense>
  );
}
