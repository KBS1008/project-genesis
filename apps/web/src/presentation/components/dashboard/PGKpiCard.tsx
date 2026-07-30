'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';

export type PGKpiCardVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** KPI metric card for executive dashboards (DB-002). */
export function PGKpiCard({
  label,
  value,
  hint,
  trend,
  variant = 'default',
  state = 'idle',
  errorMessage,
  emptyTitle,
  placeholder,
}: PGWidgetSurfaceProps & {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly trend?: string;
  readonly variant?: PGKpiCardVariant;
  readonly placeholder?: string;
}) {
  return (
    <article
      className={`pg-kpi-card pg-kpi-card-${variant}`}
      aria-label={label}
      data-placeholder={placeholder}
    >
      <PGWidgetSurface state={state} errorMessage={errorMessage} emptyTitle={emptyTitle}>
        <span className="pg-kpi-card-label">{label}</span>
        <strong className="pg-kpi-card-value">{value}</strong>
        {hint !== undefined ? <span className="pg-kpi-card-hint">{hint}</span> : null}
        {trend !== undefined ? <span className="pg-kpi-card-trend">{trend}</span> : null}
      </PGWidgetSurface>
    </article>
  );
}
