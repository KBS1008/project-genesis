'use client';

import type { ReactNode } from 'react';
import { EmptyState } from '@/presentation/primitives/EmptyState';

/** PG chart shell with title, current value, empty state, and responsive canvas. */
export function PGChartWidget({
  title,
  currentValue,
  ariaLabel,
  wide = false,
  minPoints = 2,
  pointCount,
  emptyTitle = 'Noch zu wenig Verlauf.',
  emptyHint = 'Führen Sie Simulation-Ticks aus, um Trends zu sehen.',
  children,
}: {
  readonly title: string;
  readonly currentValue?: string;
  readonly ariaLabel: string;
  readonly wide?: boolean;
  readonly minPoints?: number;
  readonly pointCount: number;
  readonly emptyTitle?: string;
  readonly emptyHint?: string;
  readonly children: ReactNode;
}) {
  const hasEnoughPoints = pointCount >= minPoints;

  return (
    <article
      className={`pg-chart-widget${wide ? ' pg-chart-widget-wide' : ''}`}
      aria-label={ariaLabel}
    >
      <header className="pg-chart-widget-header">
        <h3 className="pg-chart-widget-title">{title}</h3>
        {currentValue !== undefined ? (
          <span className="pg-chart-widget-value">{currentValue}</span>
        ) : null}
      </header>
      {hasEnoughPoints ? (
        <div className="pg-chart-widget-canvas">{children}</div>
      ) : (
        <EmptyState title={emptyTitle} hint={emptyHint} />
      )}
    </article>
  );
}
