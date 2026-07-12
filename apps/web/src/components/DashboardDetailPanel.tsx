'use client';

import type { ReactNode } from 'react';
import type {
  BuildingReadModel,
  GameSessionDashboard,
  ProductionJobSessionReadModel,
  ResearchJobSessionReadModel,
  TransportOrderSessionReadModel,
} from '@/lib/api';

export type DetailSelection =
  | { readonly kind: 'overview' }
  | { readonly kind: 'building'; readonly id: string }
  | { readonly kind: 'production'; readonly id: string }
  | { readonly kind: 'transport'; readonly id: string }
  | { readonly kind: 'research'; readonly id: string };

type KeyValueEntry = readonly [label: string, value: string, valueClass?: string];

function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

function formatEnergy(value: number): string {
  return `${value.toFixed(1)} MW`;
}

function formatProductionStatus(status: string, awaitingTransport: boolean): string {
  if (status === 'WAITING' && awaitingTransport) {
    return 'Wartet auf Transport';
  }

  return status;
}

function KeyValuePanel({ entries }: { readonly entries: readonly KeyValueEntry[] }) {
  return (
    <dl className="kv">
      {entries.map(([label, value, valueClass]) => (
        <div key={label} style={{ display: 'contents' }}>
          <dt>{label}</dt>
          <dd className={valueClass}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DetailFocusCard({
  title,
  subtitle,
  onClear,
  children,
}: {
  readonly title: string;
  readonly subtitle?: string;
  readonly onClear: () => void;
  readonly children: ReactNode;
}) {
  return (
    <section className="card detail-card detail-focus">
      <div className="detail-focus-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="detail-focus-subtitle">{subtitle}</p> : null}
        </div>
        <button type="button" className="btn-secondary detail-clear" onClick={onClear}>
          Übersicht
        </button>
      </div>
      {children}
    </section>
  );
}

function BuildingFocus({
  building,
  dashboard,
  labelBuilding,
  labelRecipe,
  onClear,
}: {
  readonly building: BuildingReadModel;
  readonly dashboard: GameSessionDashboard;
  readonly labelBuilding: (id: string) => string;
  readonly labelRecipe: (id: string) => string;
  readonly onClear: () => void;
}) {
  const relatedJobs = dashboard.productionJobs.filter((job) => job.buildingId === building.id);
  const warehouse = dashboard.warehouseStorage.find((storage) => storage.buildingId === building.id);

  return (
    <DetailFocusCard
      title={building.name}
      subtitle={`Gebäude · ${labelBuilding(building.buildingTypeId)}`}
      onClear={onClear}
    >
      <KeyValuePanel
        entries={[
          ['ID', building.id],
          ['Typ', labelBuilding(building.buildingTypeId)],
          ['Status', building.status],
          ['Position', `${building.x}, ${building.y}`],
          ...(building.status === 'UNDER_CONSTRUCTION'
            ? ([
                ['Baufortschritt', formatProgress(building.constructionProgress)],
                ['Baudauer', `${building.constructionDuration} Ticks`],
              ] as const)
            : []),
          ['Produktionsjobs', String(relatedJobs.length)],
          ...(warehouse ? ([['Lagerzeilen', String(warehouse.items.length)]] as const) : []),
        ]}
      />
      {relatedJobs.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Produktion an diesem Standort</h3>
          <ul className="detail-related-list">
            {relatedJobs.map((job) => (
              <li key={job.id}>
                <span>{labelRecipe(job.recipeId)}</span>
                <span>{formatProductionStatus(job.status, job.awaitingTransport)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DetailFocusCard>
  );
}

function ProductionFocus({
  job,
  dashboard,
  labelRecipe,
  labelBuilding,
  labelResource,
  onClear,
}: {
  readonly job: ProductionJobSessionReadModel;
  readonly dashboard: GameSessionDashboard;
  readonly labelRecipe: (id: string) => string;
  readonly labelBuilding: (id: string) => string;
  readonly labelResource: (id: string) => string;
  readonly onClear: () => void;
}) {
  const building = dashboard.buildings.find((entry) => entry.id === job.buildingId);
  const relatedTransports = (dashboard.transportOrders ?? []).filter(
    (order) => order.productionJobId === job.id,
  );

  return (
    <DetailFocusCard
      title={labelRecipe(job.recipeId)}
      subtitle={`Produktion · ${building?.name ?? job.buildingId}`}
      onClear={onClear}
    >
      <KeyValuePanel
        entries={[
          ['Job-ID', job.id],
          ['Gebäude', building?.name ?? job.buildingId],
          ['Gebäudetyp', building ? labelBuilding(building.buildingTypeId) : '—'],
          ['Status', formatProductionStatus(job.status, job.awaitingTransport)],
          ['Fortschritt', formatProgress(job.progress)],
          ['Transporte aktiv', String(job.activeTransportCount)],
          ...(job.awaitingTransport ? ([['Hinweis', 'Wartet auf Materialtransport']] as const) : []),
        ]}
      />
      {relatedTransports.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Zugehörige Transporte</h3>
          <ul className="detail-related-list">
            {relatedTransports.map((order) => (
              <li key={order.id}>
                <span>
                  {order.amount}× {labelResource(order.resourceId)}
                </span>
                <span>
                  {order.sourceBuildingName} → {order.destinationBuildingName}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DetailFocusCard>
  );
}

function TransportFocus({
  order,
  labelResource,
  onClear,
}: {
  readonly order: TransportOrderSessionReadModel;
  readonly labelResource: (id: string) => string;
  readonly onClear: () => void;
}) {
  return (
    <DetailFocusCard
      title={`${order.amount}× ${labelResource(order.resourceId)}`}
      subtitle="Transport & Logistik"
      onClear={onClear}
    >
      <KeyValuePanel
        entries={[
          ['Transport-ID', order.id],
          ['Ressource', labelResource(order.resourceId)],
          ['Menge', String(order.amount)],
          ['Route', `${order.sourceBuildingName} → ${order.destinationBuildingName}`],
          ['Quelle', order.sourceBuildingName],
          ['Ziel', order.destinationBuildingName],
          ['Status', order.status],
          ['Fortschritt', formatProgress(order.progress)],
          ['Produktionsjob', order.productionJobId],
          ['Rezept', order.recipeName ?? '—'],
        ]}
      />
    </DetailFocusCard>
  );
}

function ResearchFocus({
  job,
  labelTechnology,
  onClear,
}: {
  readonly job: ResearchJobSessionReadModel;
  readonly labelTechnology: (id: string) => string;
  readonly onClear: () => void;
}) {
  return (
    <DetailFocusCard
      title={labelTechnology(job.technologyId)}
      subtitle="Forschung"
      onClear={onClear}
    >
      <KeyValuePanel
        entries={[
          ['Job-ID', job.id],
          ['Technologie', labelTechnology(job.technologyId)],
          ['Status', job.status],
          ['Fortschritt', formatProgress(job.progress)],
        ]}
      />
    </DetailFocusCard>
  );
}

/** Validates that the current selection still references dashboard data. */
export function normalizeDetailSelection(
  dashboard: GameSessionDashboard | null,
  selection: DetailSelection,
): DetailSelection {
  if (selection.kind === 'overview' || dashboard?.company === null || dashboard?.company === undefined) {
    return { kind: 'overview' };
  }

  switch (selection.kind) {
    case 'building':
      return dashboard.buildings.some((building) => building.id === selection.id)
        ? selection
        : { kind: 'overview' };
    case 'production':
      return dashboard.productionJobs.some((job) => job.id === selection.id)
        ? selection
        : { kind: 'overview' };
    case 'transport':
      return (dashboard.transportOrders ?? []).some((order) => order.id === selection.id)
        ? selection
        : { kind: 'overview' };
    case 'research':
      return dashboard.researchJobs.some((job) => job.id === selection.id)
        ? selection
        : { kind: 'overview' };
    default:
      return { kind: 'overview' };
  }
}

/** Sticky detail panel with drill-down focus and company overview sections. */
export function DashboardDetailPanel({
  dashboard,
  selection,
  onClearSelection,
  labelBuilding,
  labelRecipe,
  labelResource,
  labelTechnology,
  renderMarketTable,
}: {
  readonly dashboard: GameSessionDashboard | null;
  readonly selection: DetailSelection;
  readonly onClearSelection: () => void;
  readonly labelBuilding: (id: string) => string;
  readonly labelRecipe: (id: string) => string;
  readonly labelResource: (id: string) => string;
  readonly labelTechnology: (id: string) => string;
  readonly renderMarketTable: ReactNode;
}) {
  const focus =
    dashboard !== null && selection.kind !== 'overview'
      ? (() => {
          switch (selection.kind) {
            case 'building': {
              const building = dashboard.buildings.find((entry) => entry.id === selection.id);
              return building ? (
                <BuildingFocus
                  building={building}
                  dashboard={dashboard}
                  labelBuilding={labelBuilding}
                  labelRecipe={labelRecipe}
                  onClear={onClearSelection}
                />
              ) : null;
            }
            case 'production': {
              const job = dashboard.productionJobs.find((entry) => entry.id === selection.id);
              return job ? (
                <ProductionFocus
                  job={job}
                  dashboard={dashboard}
                  labelRecipe={labelRecipe}
                  labelBuilding={labelBuilding}
                  labelResource={labelResource}
                  onClear={onClearSelection}
                />
              ) : null;
            }
            case 'transport': {
              const order = (dashboard.transportOrders ?? []).find(
                (entry) => entry.id === selection.id,
              );
              return order ? (
                <TransportFocus
                  order={order}
                  labelResource={labelResource}
                  onClear={onClearSelection}
                />
              ) : null;
            }
            case 'research': {
              const job = dashboard.researchJobs.find((entry) => entry.id === selection.id);
              return job ? (
                <ResearchFocus
                  job={job}
                  labelTechnology={labelTechnology}
                  onClear={onClearSelection}
                />
              ) : null;
            }
            default:
              return null;
          }
        })()
      : null;

  return (
    <aside className="dashboard-detail" aria-label="Detailinformationen">
      {focus}

      {selection.kind === 'overview' ? (
        <p className="detail-hint">Zeile in einer Tabelle anklicken für Details.</p>
      ) : null}

      <section className={`card detail-card${selection.kind !== 'overview' ? ' detail-card-compact' : ''}`}>
        <h2>Firma</h2>
        {!dashboard?.company ? (
          <KeyValuePanel entries={[['Status', 'Kein aktives Spiel']]} />
        ) : (
          <KeyValuePanel
            entries={[
              ['Name', dashboard.company.name],
              ['ID', dashboard.company.id],
              ['Owner', dashboard.company.ownerId],
              ['Status', dashboard.company.status],
            ]}
          />
        )}
      </section>

      <section className={`card detail-card${selection.kind !== 'overview' ? ' detail-card-compact' : ''}`}>
        <h2>Finanzen</h2>
        {!dashboard?.finance ? (
          <KeyValuePanel entries={[['Status', '—']]} />
        ) : (
          <KeyValuePanel
            entries={[
              ['Cash', `${dashboard.finance.cashBalance.toLocaleString('de-DE')} GC`],
              ['Reserviert', `${dashboard.finance.reservedCash.toLocaleString('de-DE')} GC`],
              ['Verfügbar', `${dashboard.finance.availableCash.toLocaleString('de-DE')} GC`],
            ]}
          />
        )}
      </section>

      <section
        className={`card detail-card${dashboard?.energy?.hasDeficit ? ' card-warning' : ''}${selection.kind !== 'overview' ? ' detail-card-compact' : ''}`}
      >
        <h2>Energie</h2>
        {!dashboard?.energy ? (
          <KeyValuePanel entries={[['Status', '—']]} />
        ) : (
          <KeyValuePanel
            entries={[
              ['Erzeugung', formatEnergy(dashboard.energy.generation)],
              ['Verbrauch', formatEnergy(dashboard.energy.consumption)],
              [
                'Reserve',
                formatEnergy(dashboard.energy.reserve),
                dashboard.energy.reserve < 0 ? 'kv-value-error' : 'kv-value-success',
              ],
              [
                'Netz',
                dashboard.energy.usesBaselineGrid
                  ? 'Öffentliches Netz (30 MW)'
                  : 'Eigenversorgung',
              ],
              [
                'Status',
                dashboard.energy.hasDeficit ? 'Defizit' : 'Stabil',
                dashboard.energy.hasDeficit ? 'kv-value-warning' : 'kv-value-success',
              ],
            ]}
          />
        )}
      </section>

      <section className={`card detail-card${selection.kind !== 'overview' ? ' detail-card-compact' : ''}`}>
        <h2>Marktpreise</h2>
        <div className="table-wrap">{renderMarketTable}</div>
      </section>

      <section className={`card detail-card${selection.kind !== 'overview' ? ' detail-card-compact' : ''}`}>
        <h2>Meilensteine</h2>
        <ul className="milestone-list">
          {(dashboard?.milestones ?? []).length === 0 ? (
            <li className="empty milestone-empty">Noch keine Meilensteine geladen.</li>
          ) : (
            dashboard?.milestones.map((milestone) => (
              <li
                key={milestone.id}
                className={milestone.completed ? 'milestone-done' : 'milestone-pending'}
              >
                <span className="milestone-name">{milestone.name}</span>
                <span className="milestone-id">{milestone.id}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </aside>
  );
}
