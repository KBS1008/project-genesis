'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';

/** Employees table for the operations dashboard. */
export function PGEmployeesWidget({
  title = 'Mitarbeiter',
  subtitle = 'Eingestelltes Personal, Gehälter und Gebäudezuweisungen.',
  rows,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Noch keine Mitarbeiter.',
  emptyHint = 'Stellen Sie Produktions- oder Logistikpersonal ein.',
  selectedEmployeeId,
  onEmployeeClick,
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows: readonly PGOperationsTableRow[];
  readonly selectedEmployeeId?: string | null;
  readonly onEmployeeClick?: (employeeId: string) => void;
}) {
  return (
    <section className="pg-widget pg-employees-widget" aria-labelledby="pg-employees-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-employees-widget-title" className="pg-widget-title">
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
          columns={['Name', 'Typ', 'Gehalt', 'Produktivität', 'Zuweisung']}
          rows={rows}
          searchable
          searchPlaceholder="Mitarbeiter suchen…"
          selectedRowId={selectedEmployeeId}
          onRowClick={onEmployeeClick}
          emptyTitle="Noch keine Mitarbeiter."
          emptyHint="Stellen Sie Produktions- oder Logistikpersonal ein."
          ariaLabel="Mitarbeiter"
        />
      </PGWidgetSurface>
    </section>
  );
}
