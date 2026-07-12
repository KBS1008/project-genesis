'use client';

import type { ReactNode } from 'react';
import type {
  BuildingReadModel,
  FinanceTransactionReadModel,
  GameSessionDashboard,
  ProductionJobSessionReadModel,
  ResearchJobSessionReadModel,
  TransportOrderSessionReadModel,
  WarehouseStorageReadModel,
} from '@/lib/api';

export type DetailSelection =
  | { readonly kind: 'overview' }
  | { readonly kind: 'building'; readonly id: string }
  | { readonly kind: 'production'; readonly id: string }
  | { readonly kind: 'transport'; readonly id: string }
  | { readonly kind: 'research'; readonly id: string }
  | { readonly kind: 'finance' }
  | { readonly kind: 'transaction'; readonly id: string }
  | { readonly kind: 'logistics' }
  | { readonly kind: 'warehouse'; readonly id: string };

type KeyValueEntry = readonly [label: string, value: string, valueClass?: string];

function formatCurrency(value: number, currency = 'GC'): string {
  return `${value.toLocaleString('de-DE')} ${currency}`;
}

function formatTransactionType(type: string): string {
  const labels: Record<string, string> = {
    SALE: 'Verkauf',
    PURCHASE: 'Einkauf',
    PRODUCTION_COST: 'Produktionskosten',
    BUILDING_COST: 'Baukosten',
    BUILDING_REFUND: 'Bau-Rückerstattung',
    RESEARCH_COST: 'Forschungskosten',
    RESEARCH_REWARD: 'Forschungsprämie',
    MAINTENANCE: 'Wartung',
    SALARY: 'Gehalt',
    LOAN_RECEIVED: 'Kredit erhalten',
    LOAN_PAYMENT: 'Kreditrate',
    INTEREST: 'Zinsen',
    MARKET_FEE: 'Marktgebühr',
    TRANSPORT_COST: 'Transportkosten',
    CONTRACT_PAYMENT: 'Vertragszahlung',
    NPC_REWARD: 'NPC-Belohnung',
    TAX: 'Steuer',
    ADMIN: 'Administration',
    SYSTEM: 'System',
  };

  return labels[type] ?? type;
}

function formatTransactionDirection(direction: string, amount: number): string {
  if (direction === 'IN') {
    return `+${amount.toLocaleString('de-DE')}`;
  }

  if (direction === 'OUT') {
    return `−${amount.toLocaleString('de-DE')}`;
  }

  return amount.toLocaleString('de-DE');
}

function transactionDirectionClass(direction: string): string | undefined {
  if (direction === 'IN') {
    return 'kv-value-success';
  }

  if (direction === 'OUT') {
    return 'kv-value-error';
  }

  return undefined;
}

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

function FinanceFocus({
  dashboard,
  onClear,
}: {
  readonly dashboard: GameSessionDashboard;
  readonly onClear: () => void;
}) {
  const finance = dashboard.finance;
  const recentTransactions = dashboard.financeTransactions.slice(0, 5);

  if (finance === null) {
    return null;
  }

  return (
    <DetailFocusCard title="Finanzen" subtitle="Kontostand & Buchungen" onClear={onClear}>
      <KeyValuePanel
        entries={[
          ['Konto-ID', finance.id],
          ['Währung', finance.currency],
          ['Cash', formatCurrency(finance.cashBalance, finance.currency)],
          ['Reserviert', formatCurrency(finance.reservedCash, finance.currency)],
          ['Verfügbar', formatCurrency(finance.availableCash, finance.currency)],
          ['Buchungen gesamt', String(dashboard.financeTransactions.length)],
        ]}
      />
      {recentTransactions.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Letzte Buchungen</h3>
          <ul className="detail-related-list">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id}>
                <span>{formatTransactionType(transaction.transactionType)}</span>
                <span className={transactionDirectionClass(transaction.direction)}>
                  {formatTransactionDirection(transaction.direction, transaction.amount)}{' '}
                  {finance.currency}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DetailFocusCard>
  );
}

function TransactionFocus({
  transaction,
  currency,
  onClear,
}: {
  readonly transaction: FinanceTransactionReadModel;
  readonly currency: string;
  readonly onClear: () => void;
}) {
  return (
    <DetailFocusCard
      title={formatTransactionType(transaction.transactionType)}
      subtitle="Finanzbuchung"
      onClear={onClear}
    >
      <KeyValuePanel
        entries={[
          ['Buchungs-ID', transaction.id],
          ['Typ', formatTransactionType(transaction.transactionType)],
          ['Richtung', transaction.direction],
          [
            'Betrag',
            `${formatTransactionDirection(transaction.direction, transaction.amount)} ${currency}`,
            transactionDirectionClass(transaction.direction),
          ],
          ['Saldo vorher', formatCurrency(transaction.balanceBefore, currency)],
          ['Saldo nachher', formatCurrency(transaction.balanceAfter, currency)],
          ['Reserviert Δ', String(transaction.reservedCashDelta)],
          ['Simulationszeit', String(transaction.timestamp)],
        ]}
      />
    </DetailFocusCard>
  );
}

function LogisticsFocus({
  dashboard,
  labelResource,
  labelRecipe,
  onClear,
}: {
  readonly dashboard: GameSessionDashboard;
  readonly labelResource: (id: string) => string;
  readonly labelRecipe: (id: string) => string;
  readonly onClear: () => void;
}) {
  const logistics = dashboard.logistics;
  const activeTransports = (dashboard.transportOrders ?? []).filter(
    (order) => order.status === 'IN_PROGRESS',
  );
  const waitingJobs = dashboard.productionJobs.filter(
    (job) => job.status === 'WAITING' && job.awaitingTransport,
  );

  return (
    <DetailFocusCard title="Logistik" subtitle="Transport & Lager" onClear={onClear}>
      {!logistics ? (
        <KeyValuePanel entries={[['Status', '—']]} />
      ) : (
        <KeyValuePanel
          entries={[
            ['Lagerhaus aktiv', logistics.hasActiveWarehouse ? 'Ja' : 'Nein'],
            ['Transporte unterwegs', String(logistics.activeTransportCount)],
            ['Produktion wartet', String(logistics.waitingProductionCount)],
            ['Lagerzeilen', String(logistics.warehouseResourceLines)],
            ['Einheiten im Lager', String(logistics.warehouseTotalUnits)],
            ...(logistics.statusMessage ? ([['Status', logistics.statusMessage]] as const) : []),
          ]}
        />
      )}
      {activeTransports.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Aktive Transporte</h3>
          <ul className="detail-related-list">
            {activeTransports.map((order) => (
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
      {waitingJobs.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Wartende Produktion</h3>
          <ul className="detail-related-list">
            {waitingJobs.map((job) => (
              <li key={job.id}>
                <span>{labelRecipe(job.recipeId)}</span>
                <span>Wartet auf Material</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {(dashboard.warehouseStorage ?? []).length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Lagerhäuser</h3>
          <ul className="detail-related-list">
            {dashboard.warehouseStorage.map((storage) => {
              const units = storage.items.reduce((total, item) => total + item.quantity, 0);
              return (
                <li key={storage.buildingId}>
                  <span>{storage.buildingName}</span>
                  <span>
                    {storage.items.length} Zeilen · {units} Einheiten
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </DetailFocusCard>
  );
}

function WarehouseFocus({
  storage,
  dashboard,
  labelResource,
  onClear,
}: {
  readonly storage: WarehouseStorageReadModel;
  readonly dashboard: GameSessionDashboard;
  readonly labelResource: (id: string) => string;
  readonly onClear: () => void;
}) {
  const totalUnits = storage.items.reduce((total, item) => total + item.quantity, 0);
  const relatedTransports = (dashboard.transportOrders ?? []).filter(
    (order) =>
      order.sourceBuildingId === storage.buildingId ||
      order.destinationBuildingId === storage.buildingId,
  );

  return (
    <DetailFocusCard
      title={storage.buildingName}
      subtitle="Lagerhaus"
      onClear={onClear}
    >
      <KeyValuePanel
        entries={[
          ['Gebäude-ID', storage.buildingId],
          ['Ressourcenzeilen', String(storage.items.length)],
          ['Einheiten gesamt', String(totalUnits)],
        ]}
      />
      {storage.items.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Bestand</h3>
          <ul className="detail-related-list">
            {storage.items.map((item) => (
              <li key={item.resourceId}>
                <span>{labelResource(item.resourceId)}</span>
                <span>
                  {item.available} verfügbar ({item.quantity} gesamt)
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {relatedTransports.length > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">Verknüpfte Transporte</h3>
          <ul className="detail-related-list">
            {relatedTransports.map((order) => (
              <li key={order.id}>
                <span>
                  {order.amount}× {labelResource(order.resourceId)}
                </span>
                <span>{order.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
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
    case 'finance':
      return dashboard.finance === null ? { kind: 'overview' } : selection;
    case 'transaction':
      return dashboard.financeTransactions.some((transaction) => transaction.id === selection.id)
        ? selection
        : { kind: 'overview' };
    case 'logistics':
      return dashboard.logistics === null ? { kind: 'overview' } : selection;
    case 'warehouse':
      return (dashboard.warehouseStorage ?? []).some(
        (storage) => storage.buildingId === selection.id,
      )
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
  onSelectFinance,
  onSelectLogistics,
  labelBuilding,
  labelRecipe,
  labelResource,
  labelTechnology,
  renderMarketTable,
}: {
  readonly dashboard: GameSessionDashboard | null;
  readonly selection: DetailSelection;
  readonly onClearSelection: () => void;
  readonly onSelectFinance: () => void;
  readonly onSelectLogistics: () => void;
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
            case 'finance':
              return <FinanceFocus dashboard={dashboard} onClear={onClearSelection} />;
            case 'transaction': {
              const transaction = dashboard.financeTransactions.find(
                (entry) => entry.id === selection.id,
              );
              return transaction ? (
                <TransactionFocus
                  transaction={transaction}
                  currency={dashboard.finance?.currency ?? 'GC'}
                  onClear={onClearSelection}
                />
              ) : null;
            }
            case 'logistics':
              return (
                <LogisticsFocus
                  dashboard={dashboard}
                  labelResource={labelResource}
                  labelRecipe={labelRecipe}
                  onClear={onClearSelection}
                />
              );
            case 'warehouse': {
              const storage = (dashboard.warehouseStorage ?? []).find(
                (entry) => entry.buildingId === selection.id,
              );
              return storage ? (
                <WarehouseFocus
                  storage={storage}
                  dashboard={dashboard}
                  labelResource={labelResource}
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

      <section
        className={`card detail-card detail-card-selectable${selection.kind === 'finance' || selection.kind === 'transaction' ? ' detail-card-active' : ''}${selection.kind !== 'overview' && selection.kind !== 'finance' && selection.kind !== 'transaction' ? ' detail-card-compact' : ''}`}
      >
        <button type="button" className="detail-section-button" onClick={onSelectFinance}>
          <h2>Finanzen</h2>
          <span className="detail-section-hint">Klicken für Kontodetails</span>
        </button>
        {!dashboard?.finance ? (
          <KeyValuePanel entries={[['Status', '—']]} />
        ) : (
          <KeyValuePanel
            entries={[
              ['Cash', formatCurrency(dashboard.finance.cashBalance, dashboard.finance.currency)],
              ['Reserviert', formatCurrency(dashboard.finance.reservedCash, dashboard.finance.currency)],
              ['Verfügbar', formatCurrency(dashboard.finance.availableCash, dashboard.finance.currency)],
            ]}
          />
        )}
      </section>

      <section
        className={`card detail-card detail-card-selectable${selection.kind === 'logistics' || selection.kind === 'warehouse' || selection.kind === 'transport' ? ' detail-card-active' : ''}${selection.kind !== 'overview' && selection.kind !== 'logistics' && selection.kind !== 'warehouse' && selection.kind !== 'transport' ? ' detail-card-compact' : ''}`}
      >
        <button type="button" className="detail-section-button" onClick={onSelectLogistics}>
          <h2>Logistik</h2>
          <span className="detail-section-hint">Klicken für Transport- &amp; Lagerdetails</span>
        </button>
        {!dashboard?.logistics ? (
          <KeyValuePanel entries={[['Status', '—']]} />
        ) : (
          <KeyValuePanel
            entries={[
              ['Transporte', String(dashboard.logistics.activeTransportCount)],
              ['Wartende Jobs', String(dashboard.logistics.waitingProductionCount)],
              ['Im Lagerhaus', String(dashboard.logistics.warehouseTotalUnits)],
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
