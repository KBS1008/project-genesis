'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';

/** Milestone progression table for the operations dashboard. */
export function PGMilestonesWidget({
  title = 'Meilensteine',
  subtitle = 'Erreichbare Ziele und abgeschlossene Erfolge.',
  rows,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Meilensteine geladen.',
  emptyHint = 'Meilensteine erscheinen nach Spielstart.',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows: readonly PGOperationsTableRow[];
}) {
  return (
    <section className="pg-widget pg-milestones-widget" aria-labelledby="pg-milestones-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-milestones-widget-title" className="pg-widget-title">
          {title}
        </h3>
      </div>
      <p className="pg-widget-subtitle">{subtitle}</p>
      <PGWidgetSurface
        state={rows.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
      >
        <PGOperationsTable
          columns={[
            { label: '', ariaLabel: 'Erfolgsbild' },
            { label: '', ariaLabel: 'Abzeichen' },
            'Meilenstein',
            'Status',
          ]}
          columnCount={4}
          rows={rows}
          searchable
          searchPlaceholder="Meilensteine suchen…"
          emptyTitle="Keine Meilensteine geladen."
          emptyHint="Meilensteine erscheinen nach Spielstart."
          ariaLabel="Meilensteine"
        />
      </PGWidgetSurface>
    </section>
  );
}
