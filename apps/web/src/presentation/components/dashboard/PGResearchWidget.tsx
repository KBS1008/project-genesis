'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGResearchRow = {
  readonly id: string;
  readonly technologyLabel: string;
  readonly statusLabel: string;
  readonly progressLabel: string;
};

/** Research activity widget (DB-007). */
export function PGResearchWidget({
  title = 'Forschung',
  activeCount,
  hint,
  jobs,
  completedLabels,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine aktiven Forschungsjobs',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly activeCount: number;
  readonly hint?: string;
  readonly jobs: readonly PGResearchRow[];
  readonly completedLabels?: readonly string[];
}) {
  return (
    <section className="pg-widget pg-research-widget" aria-labelledby="pg-research-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-research-widget-title" className="pg-widget-title">
          {title}
        </h3>
        <span className="pg-widget-badge">{activeCount}</span>
      </div>
      {hint !== undefined ? <p className="pg-widget-subtitle">{hint}</p> : null}
      <PGWidgetSurface
        state={jobs.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
      >
        <QueryRows
          columns={['Technologie', 'Status', 'Fortschritt']}
          rows={jobs.map((job) => ({
            id: job.id,
            cells: [job.technologyLabel, job.statusLabel, job.progressLabel],
          }))}
        />
        {completedLabels !== undefined && completedLabels.length > 0 ? (
          <div className="pg-widget-tags">
            {completedLabels.slice(0, 6).map((label) => (
              <span key={label} className="pg-widget-tag">
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </PGWidgetSurface>
    </section>
  );
}
