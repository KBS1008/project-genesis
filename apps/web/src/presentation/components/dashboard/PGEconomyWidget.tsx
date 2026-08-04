'use client';

import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';

/** Economy overview with delivery contracts for the operations dashboard. */
export function PGEconomyWidget({
  title = 'Wirtschaft',
  subtitle,
  taxWarning,
  rows,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Lieferverträge.',
  emptyHint = 'NPC-Verträge erscheinen nach Spielstart automatisch.',
  warning = false,
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle: string;
  readonly taxWarning?: string | null;
  readonly rows: readonly PGOperationsTableRow[];
  readonly warning?: boolean;
}) {
  return (
    <section
      className={`pg-widget pg-economy-widget${warning ? ' pg-widget-warning' : ''}`}
      aria-labelledby="pg-economy-widget-title"
    >
      <div className="pg-widget-header">
        <h3 id="pg-economy-widget-title" className="pg-widget-title">
          {title}
        </h3>
      </div>
      <p className="pg-widget-subtitle">{subtitle}</p>
      {taxWarning !== undefined && taxWarning !== null ? (
        <StatusBanner tone="warning" message={taxWarning} />
      ) : null}
      <PGWidgetSurface
        state={rows.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
      >
        <PGOperationsTable
          columns={['Ressource', 'Menge', 'Zahlung', 'Intervall', 'Status']}
          rows={rows}
          emptyTitle="Keine Verträge."
          ariaLabel="Lieferverträge"
        />
      </PGWidgetSurface>
    </section>
  );
}
