'use client';

import { formatProgress } from '@/presentation/formatting/presentation-formatters';

/** Accessible production progress display for operation tables. */
export function ProductionProgressCell({
  percent,
  label,
}: {
  readonly percent: number;
  readonly label: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="pg-construction-status">
      <progress className="pg-production-progress" value={clamped} max={100}>
        {label}
      </progress>
      <span className="pg-progress-label">{formatProgress(clamped)}</span>
    </div>
  );
}
