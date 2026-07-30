'use client';

import type { ReactNode } from 'react';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import type { PGWidgetSurfaceProps } from './pg-widget-state';
import { PGSkeleton } from './PGSkeleton';

/** Renders loading, empty, and error states for dashboard widgets. */
export function PGWidgetSurface({
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Daten',
  emptyHint,
  loadingLabel = 'Wird geladen…',
  children,
}: PGWidgetSurfaceProps & {
  readonly children: ReactNode;
}) {
  if (state === 'loading') {
    return (
      <div className="pg-widget-surface">
        <LoadingState label={loadingLabel} />
        <PGSkeleton lines={2} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="pg-widget-surface">
        <StatusBanner tone="error" message={errorMessage ?? 'Daten konnten nicht geladen werden.'} />
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="pg-widget-surface">
        <EmptyState title={emptyTitle} hint={emptyHint} />
      </div>
    );
  }

  return <div className="pg-widget-surface">{children}</div>;
}
