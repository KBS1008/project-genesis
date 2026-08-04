'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';

/** Market prices table for the operations dashboard. */
export function PGMarketWidget({
  title = 'Markt',
  subtitle = 'Preise, Angebot, Nachfrage und Trend je Ressource. Handelsgebühr: 2 % (min. 1 GC) pro Transaktion.',
  rows,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Noch keine Marktdaten.',
  emptyHint = 'Starten Sie ein Spiel, um dynamische Preise zu sehen.',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows: readonly PGOperationsTableRow[];
}) {
  return (
    <section className="pg-widget pg-market-widget" aria-labelledby="pg-market-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-market-widget-title" className="pg-widget-title">
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
          columns={['Ressource', 'Preis', 'Δ Basis', 'Angebot', 'Nachfrage', 'Druck', 'Trend', 'Volumen']}
          columnCount={8}
          rows={rows}
          searchable
          searchPlaceholder="Marktpreise suchen…"
          emptyTitle="Keine Marktpreise geladen."
          ariaLabel="Marktpreise"
        />
      </PGWidgetSurface>
    </section>
  );
}
