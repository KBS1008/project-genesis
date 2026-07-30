'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGProductionRow = {
  readonly id: string;
  readonly buildingLabel: string;
  readonly recipeLabel: string;
  readonly statusLabel: string;
  readonly progressLabel: string;
};

/** Production activity widget (DB-006). */
export function PGProductionWidget({
  title = 'Produktion',
  activeCount,
  hint,
  jobs,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine aktiven Produktionsjobs',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly activeCount: number;
  readonly hint?: string;
  readonly jobs: readonly PGProductionRow[];
}) {
  return (
    <section className="pg-widget pg-production-widget" aria-labelledby="pg-production-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-production-widget-title" className="pg-widget-title">
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
          columns={['Gebäude', 'Rezept', 'Status', 'Fortschritt']}
          rows={jobs.map((job) => ({
            id: job.id,
            cells: [job.buildingLabel, job.recipeLabel, job.statusLabel, job.progressLabel],
          }))}
        />
      </PGWidgetSurface>
    </section>
  );
}
