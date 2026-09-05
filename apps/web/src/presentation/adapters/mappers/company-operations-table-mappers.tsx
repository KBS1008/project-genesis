import type { ReactNode } from 'react';
import type { MarketPriceReadModel } from '@/presentation/adapters/api/client';
import type { PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';
import type { PGMarketTrend } from '@/presentation/components/dashboard/PGMarketTrendBadge';
import type { PGInventoryWarehouseBlock } from '@/presentation/components/dashboard/PGInventoryWidget';
import type { PGProductionRow } from '@/presentation/components/dashboard/PGProductionWidget';
import type { PGResearchRow } from '@/presentation/components/dashboard/PGResearchWidget';
import type { PGSupplyChainRow } from '@/presentation/components/dashboard/PGSupplyChainWidget';
import type {
  CompanyDashboardViewData,
  EconomySectionViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { BuildingConstructionStatus } from '@/presentation/screens/company/BuildingConstructionStatus';
import { PGMarketTrendBadge } from '@/presentation/components/dashboard/PGMarketTrendBadge';
import { ResourceIcon } from '@/presentation/components/assets/ResourceIcon';

function joinSearchParts(parts: readonly (string | number)[]): string {
  return parts.map((part) => String(part)).join(' ');
}

type MarketPriceRowSource = {
  readonly resourceId: string;
  readonly resourceLabel: string;
  readonly lastPrice: number;
  readonly changePercent: number;
  readonly totalSupply: number;
  readonly baselineDemand: number;
  readonly pressureIndex: number;
  readonly trend: PGMarketTrend;
  readonly tradeVolume: number;
};

function buildMarketPriceRow(price: MarketPriceRowSource): PGOperationsTableRow {
  return Object.freeze({
    id: price.resourceId,
    cells: Object.freeze([
      price.resourceLabel,
      `${price.lastPrice.toLocaleString('de-DE')} GC`,
      `${price.changePercent > 0 ? '+' : ''}${price.changePercent.toLocaleString('de-DE')} %`,
      String(price.totalSupply),
      String(price.baselineDemand),
      price.pressureIndex.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      <PGMarketTrendBadge
        key={`trend-${price.resourceId}`}
        trend={price.trend}
        changePercent={price.changePercent}
      />,
      String(price.tradeVolume),
    ]) as readonly (string | ReactNode)[],
    searchText: joinSearchParts([
      price.resourceLabel,
      price.lastPrice,
      price.totalSupply,
      price.baselineDemand,
      price.pressureIndex,
      price.trend,
      price.tradeVolume,
    ]),
  });
}

export type OperationsEconomyPanelViewData = {
  readonly subtitle: string;
  readonly taxWarning: string | null;
  readonly warning: boolean;
  readonly contractRows: readonly PGOperationsTableRow[];
};

/** Maps building rows to PG operations table rows with construction status cells. */
export function mapOperationsBuildingRows(
  buildings: CompanyDashboardViewData['buildings'],
): readonly PGOperationsTableRow[] {
  return Object.freeze(
    buildings.map((building) =>
      Object.freeze({
        id: building.id,
        cells: Object.freeze([
          building.name,
          building.buildingTypeLabel,
          <BuildingConstructionStatus key={`status-${building.id}`} building={building} />,
          building.positionLabel,
        ]) as readonly (string | ReactNode)[],
        searchText: joinSearchParts([
          building.name,
          building.buildingTypeLabel,
          building.statusLabel,
          building.positionLabel,
        ]),
      }),
    ),
  );
}

/** Maps employee rows to PG operations table rows. */
export function mapOperationsEmployeeRows(
  employees: CompanyDashboardViewData['employees'],
): readonly PGOperationsTableRow[] {
  return Object.freeze(
    employees.map((employee) =>
      Object.freeze({
        id: employee.id,
        cells: Object.freeze([
          employee.displayName,
          employee.employeeTypeLabel,
          employee.salaryLabel,
          employee.productivityLabel,
          employee.assignmentLabel,
        ]),
        searchText: joinSearchParts([
          employee.displayName,
          employee.employeeTypeLabel,
          employee.salaryLabel,
          employee.productivityLabel,
          employee.assignmentLabel,
        ]),
      }),
    ),
  );
}

/** Builds economy panel view-data without hardcoded tax fallback strings. */
export function buildOperationsEconomyPanel(
  economy: EconomySectionViewData | null,
): OperationsEconomyPanelViewData {
  if (economy === null) {
    return Object.freeze({
      subtitle:
        'Unternehmenssteuer, Preisindex und Lieferverträge erscheinen nach Spielstart.',
      taxWarning: null,
      warning: false,
      contractRows: Object.freeze([]),
    });
  }

  const subtitle = `Unternehmenssteuer ${economy.corporateTaxRateLabel} alle ${economy.taxIntervalTicks} Ticks · Preisindex ${economy.priceIndexLabel} (neutral 1,00). Lieferverträge entnehmen Ressourcen nur aus dem Standort-Inventar, nicht aus Lagerhaus-Beständen.`;

  const taxWarning =
    economy.taxPaymentBlocked && economy.pendingTaxLabel !== null
      ? `Steuer offen: ${economy.pendingTaxLabel} fällig, aber die Kasse reicht nicht — die Abbuchung wird übersprungen, bis genug Cash vorhanden ist.`
      : null;

  const contractRows = Object.freeze(
    economy.contracts.map((contract) =>
      Object.freeze({
        id: contract.id,
        cells: Object.freeze([
          contract.resourceLabel,
          String(contract.amount),
          contract.paymentLabel,
          contract.intervalLabel,
          contract.statusLabel,
        ]),
        searchText: joinSearchParts([
          contract.resourceLabel,
          contract.amount,
          contract.paymentLabel,
          contract.intervalLabel,
          contract.statusLabel,
        ]),
      }),
    ),
  );

  return Object.freeze({
    subtitle,
    taxWarning,
    warning: economy.taxPaymentBlocked,
    contractRows,
  });
}

/** Maps market price chart view-data to PG market table rows. */
export function mapOperationsMarketRows(
  marketPrices: CompanyDashboardViewData['marketPrices'],
): readonly PGOperationsTableRow[] {
  return Object.freeze(
    marketPrices.map((price) => {
      const changeFromBase = price.lastPrice - price.basePrice;
      const changePercent =
        price.basePrice === 0 ? 0 : (changeFromBase / price.basePrice) * 100;

      return buildMarketPriceRow({
        resourceId: price.resourceId,
        resourceLabel: price.resourceLabel,
        lastPrice: price.lastPrice,
        changePercent,
        totalSupply: price.totalSupply,
        baselineDemand: price.baselineDemand,
        pressureIndex: price.pressureIndex,
        trend: price.trend,
        tradeVolume: 0,
      });
    }),
  );
}

/** Maps regional market price read-models to PG market table rows. */
export function mapMarketPriceRows(
  prices: readonly MarketPriceReadModel[],
  labelResource: (resourceId: string) => string,
): readonly PGOperationsTableRow[] {
  return Object.freeze(
    prices.map((price) =>
      buildMarketPriceRow({
        resourceId: price.resourceId,
        resourceLabel: labelResource(price.resourceId),
        lastPrice: price.lastPrice,
        changePercent: price.changePercent,
        totalSupply: price.totalSupply,
        baselineDemand: price.baselineDemand,
        pressureIndex: price.pressureIndex,
        trend: price.trend,
        tradeVolume: price.tradeVolume,
      }),
    ),
  );
}

/** Maps production jobs to PG production widget rows. */
export function mapOperationsProductionJobs(
  jobs: CompanyDashboardViewData['productionJobs'],
): readonly PGProductionRow[] {
  return Object.freeze(
    jobs.map((job) =>
      Object.freeze({
        id: job.id,
        buildingLabel: job.buildingLabel,
        recipeLabel: job.recipeLabel,
        statusLabel: job.statusLabel,
        progressLabel: job.progressLabel,
      }),
    ),
  );
}

/** Maps research jobs to PG research widget rows. */
export function mapOperationsResearchJobs(
  jobs: CompanyDashboardViewData['researchJobs'],
): readonly PGResearchRow[] {
  return Object.freeze(
    jobs.map((job) =>
      Object.freeze({
        id: job.id,
        technologyLabel: job.technologyLabel,
        statusLabel: job.statusLabel,
        progressLabel: job.progressLabel,
      }),
    ),
  );
}

/** Maps transport orders to PG supply-chain widget rows (detailed operations layout). */
export function mapOperationsTransportOrders(
  orders: CompanyDashboardViewData['transportOrders'],
): readonly PGSupplyChainRow[] {
  return Object.freeze(
    orders.map((order) =>
      Object.freeze({
        id: order.id,
        routeLabel: order.routeLabel,
        resourceLabel: order.resourceLabel,
        amountLabel: order.amountLabel,
        statusLabel: order.statusLabel,
        progressLabel: order.progressLabel,
        recipeLabel: order.recipeLabel,
        durationLabel: order.durationLabel,
      }),
    ),
  );
}

/** Maps finance transactions to searchable ledger rows. */
export function mapOperationsFinanceLedgerRows(
  transactions: CompanyDashboardViewData['financeTransactions'],
): readonly PGOperationsTableRow[] {
  return Object.freeze(
    transactions.map((transaction) =>
      Object.freeze({
        id: transaction.id,
        cells: Object.freeze([
          transaction.typeLabel,
          transaction.amountLabel,
          transaction.balanceLabel,
          transaction.timestampLabel,
        ]),
        searchText: joinSearchParts([
          transaction.typeLabel,
          transaction.amountLabel,
          transaction.balanceLabel,
          transaction.timestampLabel,
        ]),
      }),
    ),
  );
}

/** Maps site inventory to PG operations table rows. */
export function mapOperationsSiteInventoryRows(
  items: CompanyDashboardViewData['inventoryItems'],
): readonly PGOperationsTableRow[] {
  return Object.freeze(
    items.map((item, index) =>
      Object.freeze({
        id: `site-inventory:${item.resourceId}:${index}`,
        cells: Object.freeze([
          <span className="pg-resource-cell" key={`resource-${item.resourceId}`}>
            <ResourceIcon resourceId={item.resourceId} />
            <span className="pg-resource-cell-label">{item.resourceLabel}</span>
          </span>,
          String(item.reserved),
          String(item.available),
        ]) as readonly (string | ReactNode)[],
        searchText: joinSearchParts([item.resourceLabel, item.reserved, item.available]),
      }),
    ),
  );
}

/** Maps warehouse storage to PG inventory widget blocks. */
export function mapOperationsWarehouseBlocks(
  storage: CompanyDashboardViewData['warehouseStorage'],
): readonly PGInventoryWarehouseBlock[] {
  return Object.freeze(
    storage.map((warehouse) => {
      const totalUnits = warehouse.items.reduce((total, item) => total + item.quantity, 0);

      return Object.freeze({
        id: warehouse.id,
        buildingLabel: warehouse.buildingLabel,
        summaryRow: Object.freeze({
          id: warehouse.id,
          cells: Object.freeze([
            warehouse.buildingLabel,
            String(warehouse.items.length),
            String(totalUnits),
          ]),
          searchText: joinSearchParts([
            warehouse.buildingLabel,
            warehouse.items.length,
            totalUnits,
          ]),
        }),
        detailRows: Object.freeze(
          warehouse.items.map((item, index) =>
            Object.freeze({
              id: `${warehouse.id}:${item.resourceLabel}:${index}`,
              cells: Object.freeze([item.resourceLabel, String(item.reserved), String(item.available)]),
              searchText: joinSearchParts([item.resourceLabel, item.reserved, item.available]),
            }),
          ),
        ),
      });
    }),
  );
}
