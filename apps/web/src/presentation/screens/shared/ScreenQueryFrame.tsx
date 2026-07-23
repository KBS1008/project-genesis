'use client';

import type { ReactNode } from 'react';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';

/** Standard loading, empty-session, error, and ready states for query-backed screens. */
export function ScreenQueryFrame({
  hasGame,
  isLoading,
  errorMessage,
  loadingLabel,
  children,
}: {
  readonly hasGame: boolean;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly loadingLabel: string;
  readonly children: ReactNode;
}) {
  if (!hasGame) {
    return (
      <EmptyState
        title="Keine Session aktiv"
        hint="Starten Sie ein Spiel über das Hauptmenü."
      />
    );
  }

  if (isLoading) {
    return <LoadingState label={loadingLabel} />;
  }

  if (errorMessage !== null) {
    return <StatusBanner tone="error" message={errorMessage} />;
  }

  return children;
}
