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
  workforceAssignmentFocusBuildingId = null,
  workforceAssignmentFocusBuildingLabel = null,
  onEmployeeClick,
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows: readonly PGOperationsTableRow[];
  readonly selectedEmployeeId?: string | null;
  readonly workforceAssignmentFocusBuildingId?: string | null;
  readonly workforceAssignmentFocusBuildingLabel?: string | null;
  readonly onEmployeeClick?: (employeeId: string) => void;
}) {
  const isWorkforceFocusActive = workforceAssignmentFocusBuildingId !== null;

  return (
    <section
      className={`pg-widget pg-employees-widget${isWorkforceFocusActive ? ' is-workforce-assignment-focus' : ''}`}
      aria-labelledby="pg-employees-widget-title"
      data-workforce-assignment-focus-building={workforceAssignmentFocusBuildingId ?? undefined}
    >
      <div className="pg-widget-header">
        <h3 id="pg-employees-widget-title" className="pg-widget-title">
          {title}
        </h3>
      </div>
      <p className="pg-widget-subtitle">{subtitle}</p>
      {workforceAssignmentFocusBuildingLabel !== null ? (
        <p className="pg-workforce-assignment-focus-hint" role="status">
          Zuweisung für <strong>{workforceAssignmentFocusBuildingLabel}</strong> — Personal in der
          Seitenleiste verwalten.
        </p>
      ) : null}
      <PGWidgetSurface
        state={rows.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
      >
        <PGOperationsTable
          columns={[
            { label: '', ariaLabel: 'Rollenbild' },
            'Name',
            'Typ',
            'Gehalt',
            'Produktivität',
            'Zuweisung',
          ]}
          columnCount={6}
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
