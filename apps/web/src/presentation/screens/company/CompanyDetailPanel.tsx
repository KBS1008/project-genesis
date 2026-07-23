'use client';

import type { ReactNode } from 'react';
import type { MarketPriceChartViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type {
  CompanyDetailViewData,
  EntityDetailViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { EntityCatalogViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { MarketPricesTable } from '@/components/MarketPricesTable';

export type DetailSelection =
  | { readonly kind: 'overview' }
  | { readonly kind: 'building'; readonly id: string }
  | { readonly kind: 'production'; readonly id: string }
  | { readonly kind: 'transport'; readonly id: string }
  | { readonly kind: 'research'; readonly id: string }
  | { readonly kind: 'employee'; readonly id: string }
  | { readonly kind: 'finance' }
  | { readonly kind: 'transaction'; readonly id: string }
  | { readonly kind: 'logistics' }
  | { readonly kind: 'warehouse'; readonly id: string };

type KeyValueEntry = readonly [label: string, value: string, valueClass?: string];

function KeyValuePanel({ entries }: { readonly entries: readonly KeyValueEntry[] }) {
  return (
    <dl className="kv-panel">
      {entries.map(([label, value, valueClass]) => (
        <div key={label} className="kv-row">
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
  readonly subtitle: string;
  readonly onClear: () => void;
  readonly children: ReactNode;
}) {
  return (
    <section className="detail-focus-card">
      <div className="detail-focus-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={onClear}>
          Schließen
        </button>
      </div>
      {children}
    </section>
  );
}

function EntityDetailFocus({
  detail,
  onClear,
  relatedTitle = 'Verwandte Einträge',
}: {
  readonly detail: EntityDetailViewData;
  readonly onClear: () => void;
  readonly relatedTitle?: string;
}) {
  return (
    <DetailFocusCard title={detail.title} subtitle={detail.subtitle} onClear={onClear}>
      <KeyValuePanel entries={detail.entries} />
      {(detail.relatedItems?.length ?? 0) > 0 ? (
        <div className="detail-related">
          <h3 className="detail-related-title">{detail.relatedTitle ?? relatedTitle}</h3>
          <ul className="detail-related-list">
            {detail.relatedItems?.map((item, index) => (
              <li key={`${item.primary}-${index}`}>
                <span>{item.primary}</span>
                <span>{item.secondary}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DetailFocusCard>
  );
}

/** Validates that the current selection still references view-data entities. */
export function normalizeDetailSelection(
  catalog: EntityCatalogViewData | null,
  hasGame: boolean,
  hasFinance: boolean,
  hasLogistics: boolean,
  selection: DetailSelection,
): DetailSelection {
  if (selection.kind === 'overview' || !hasGame || catalog === null) {
    return { kind: 'overview' };
  }

  switch (selection.kind) {
    case 'building':
      return catalog.buildingIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'production':
      return catalog.productionIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'transport':
      return catalog.transportIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'research':
      return catalog.researchIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'employee':
      return catalog.employeeIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'finance':
      return hasFinance ? selection : { kind: 'overview' };
    case 'transaction':
      return catalog.transactionIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'logistics':
      return hasLogistics ? selection : { kind: 'overview' };
    case 'warehouse':
      return catalog.warehouseIds.has(selection.id) ? selection : { kind: 'overview' };
    default:
      return { kind: 'overview' };
  }
}

/** Sticky detail panel consuming immutable company view-data. */
export function CompanyDetailPanel({
  detail,
  marketPrices,
  selection,
  onClearSelection,
  onSelectFinance,
  onSelectLogistics,
}: {
  readonly detail: CompanyDetailViewData;
  readonly marketPrices: readonly MarketPriceChartViewData[];
  readonly selection: DetailSelection;
  readonly onClearSelection: () => void;
  readonly onSelectFinance: () => void;
  readonly onSelectLogistics: () => void;
}) {
  const focus =
    selection.kind !== 'overview'
      ? (() => {
          switch (selection.kind) {
            case 'building': {
              const entity = detail.buildings.get(selection.id);
              return entity ? (
                <EntityDetailFocus
                  detail={entity}
                  onClear={onClearSelection}
                  relatedTitle="Produktion an diesem Standort"
                />
              ) : null;
            }
            case 'production': {
              const entity = detail.productionJobs.get(selection.id);
              return entity ? (
                <EntityDetailFocus
                  detail={entity}
                  onClear={onClearSelection}
                  relatedTitle="Zugehörige Transporte"
                />
              ) : null;
            }
            case 'transport': {
              const entity = detail.transportOrders.get(selection.id);
              return entity ? <EntityDetailFocus detail={entity} onClear={onClearSelection} /> : null;
            }
            case 'research': {
              const entity = detail.researchJobs.get(selection.id);
              return entity ? <EntityDetailFocus detail={entity} onClear={onClearSelection} /> : null;
            }
            case 'employee': {
              const entity = detail.employees.get(selection.id);
              return entity ? <EntityDetailFocus detail={entity} onClear={onClearSelection} /> : null;
            }
            case 'finance':
              return detail.hasFinance ? (
                <DetailFocusCard
                  title="Finanzen"
                  subtitle="Kontostand & Buchungen"
                  onClear={onClearSelection}
                >
                  <KeyValuePanel entries={detail.financeEntries} />
                  {detail.recentTransactions.length > 0 ? (
                    <div className="detail-related">
                      <h3 className="detail-related-title">Letzte Buchungen</h3>
                      <ul className="detail-related-list">
                        {detail.recentTransactions.map((transaction) => (
                          <li key={transaction.id}>
                            <span>{transaction.typeLabel}</span>
                            <span className={transaction.directionClass}>{transaction.amountLabel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </DetailFocusCard>
              ) : null;
            case 'transaction': {
              const entity = detail.transactions.get(selection.id);
              return entity ? <EntityDetailFocus detail={entity} onClear={onClearSelection} /> : null;
            }
            case 'logistics':
              return detail.hasLogistics ? (
                <DetailFocusCard title="Logistik" subtitle="Transport & Lager" onClear={onClearSelection}>
                  <KeyValuePanel entries={detail.logisticsEntries} />
                  {detail.warehouseSummaries.length > 0 ? (
                    <div className="detail-related">
                      <h3 className="detail-related-title">Lagerhäuser</h3>
                      <ul className="detail-related-list">
                        {detail.warehouseSummaries.map((storage) => (
                          <li key={storage.buildingLabel}>
                            <span>{storage.buildingLabel}</span>
                            <span>{storage.summary}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </DetailFocusCard>
              ) : null;
            case 'warehouse': {
              const entity = detail.warehouseStorage.get(selection.id);
              return entity ? (
                <EntityDetailFocus detail={entity} onClear={onClearSelection} relatedTitle="Bestand" />
              ) : null;
            }
            default:
              return null;
          }
        })()
      : null;

  return (
    <aside className="dashboard-detail" aria-label="Detailansicht">
      {focus ?? (
        <section className="detail-overview">
          <h2>Unternehmensübersicht</h2>
          {detail.companyEntries.length > 0 ? (
            <KeyValuePanel entries={detail.companyEntries} />
          ) : (
            <p className="empty-state">Keine aktive Session.</p>
          )}
          {detail.hasFinance ? (
            <div className="detail-section">
              <div className="detail-section-header">
                <h3>Finanzen</h3>
                <button type="button" className="btn-secondary" onClick={onSelectFinance}>
                  Details
                </button>
              </div>
              <KeyValuePanel entries={detail.financeEntries.slice(0, 4)} />
            </div>
          ) : null}
          {detail.hasLogistics ? (
            <div className="detail-section">
              <div className="detail-section-header">
                <h3>Logistik</h3>
                <button type="button" className="btn-secondary" onClick={onSelectLogistics}>
                  Details
                </button>
              </div>
              <KeyValuePanel entries={detail.logisticsEntries.slice(0, 4)} />
            </div>
          ) : null}
          {detail.hasEnergy ? (
            <div className="detail-section">
              <h3>Energie</h3>
              <KeyValuePanel entries={detail.energyEntries} />
            </div>
          ) : null}
          {marketPrices.length > 0 ? (
            <div className="detail-section">
              <h3>Marktpreise</h3>
              <MarketPricesTable
                marketPrices={marketPrices.map((price) => ({
                  resourceId: price.resourceId,
                  basePrice: price.basePrice,
                  lastPrice: price.lastPrice,
                  tradeVolume: 0,
                  updatedAt: 0,
                  totalSupply: price.totalSupply,
                  baselineDemand: price.baselineDemand,
                  pressureIndex: price.pressureIndex,
                  changeFromBase: 0,
                  changePercent: 0,
                  trend: price.trend,
                }))}
                labelResource={(resourceId) =>
                  marketPrices.find((entry) => entry.resourceId === resourceId)?.resourceLabel ??
                  resourceId
                }
              />
            </div>
          ) : null}
        </section>
      )}
    </aside>
  );
}
