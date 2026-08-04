'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';

/** Buildings table for the operations dashboard. */
export function PGBuildingsWidget({
  title = 'Gebäude',
  subtitle = 'Alle Standorte, Baufortschritt und Status.',
  rows,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Noch keine Gebäude.',
  emptyHint = 'Platzieren Sie über die Seitenleiste Ihr erstes Gebäude.',
  selectedBuildingId,
  onBuildingClick,
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows: readonly PGOperationsTableRow[];
  readonly selectedBuildingId?: string | null;
  readonly onBuildingClick?: (buildingId: string) => void;
}) {
  return (
    <section className="pg-widget pg-buildings-widget" aria-labelledby="pg-buildings-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-buildings-widget-title" className="pg-widget-title">
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
          columns={['Name', 'Typ', 'Status', 'Pos']}
          rows={rows}
          searchable
          searchPlaceholder="Gebäude suchen…"
          selectedRowId={selectedBuildingId}
          onRowClick={onBuildingClick}
          emptyTitle="Noch keine Gebäude."
          emptyHint="Platzieren Sie über die Seitenleiste Ihr erstes Gebäude."
          ariaLabel="Gebäude"
        />
      </PGWidgetSurface>
    </section>
  );
}
