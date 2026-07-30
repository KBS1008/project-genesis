'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGCompanySummaryRow = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

export type PGRegionalPresenceRow = {
  readonly regionId: string;
  readonly regionName: string;
  readonly buildingCount: number;
  readonly buildingSummary: string;
};

/** Company overview widget (DB-009). */
export function PGCompanyWidget({
  title = 'Unternehmen',
  summaryRows,
  buildings,
  regionalPresence,
  onBuildingClick,
  onRegionClick,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Unternehmensdaten',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly summaryRows: readonly PGCompanySummaryRow[];
  readonly buildings: readonly {
    readonly id: string;
    readonly name: string;
    readonly buildingTypeLabel: string;
    readonly regionLabel: string;
    readonly statusLabel: string;
  }[];
  readonly regionalPresence: readonly PGRegionalPresenceRow[];
  readonly onBuildingClick?: (buildingId: string) => void;
  readonly onRegionClick?: (regionId: string) => void;
}) {
  return (
    <section className="pg-widget pg-company-widget" aria-labelledby="pg-company-widget-title">
      <h3 id="pg-company-widget-title" className="pg-widget-title">
        {title}
      </h3>
      <PGWidgetSurface
        state={summaryRows.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
      >
        <ul className="pg-widget-metric-list">
          {summaryRows.map((row) => (
            <li key={row.id}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </li>
          ))}
        </ul>
        {buildings.length > 0 ? (
          <QueryRows
            columns={['Name', 'Typ', 'Region', 'Status']}
            onRowClick={onBuildingClick}
            rows={buildings.map((building) => ({
              id: building.id,
              cells: [
                building.name,
                building.buildingTypeLabel,
                building.regionLabel,
                building.statusLabel,
              ],
            }))}
          />
        ) : null}
        {regionalPresence.length > 0 ? (
          <QueryRows
            columns={['Region', 'Gebäude', 'Standorte']}
            onRowClick={onRegionClick}
            rows={regionalPresence.map((presence) => ({
              id: presence.regionId,
              cells: [
                presence.regionName,
                String(presence.buildingCount),
                presence.buildingSummary,
              ],
            }))}
          />
        ) : null}
      </PGWidgetSurface>
    </section>
  );
}
