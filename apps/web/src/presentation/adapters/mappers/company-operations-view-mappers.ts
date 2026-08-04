import type { PGKpiCardVariant } from '@/presentation/components/dashboard/PGKpiCard';
import type {
  KpiStripViewData,
  OverviewStripViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';

export type OperationsKpiAction = 'finance' | 'logistics';

export type OperationsKpiCardViewData = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly trend?: string;
  readonly hint?: string;
  readonly variant: PGKpiCardVariant;
  readonly action?: OperationsKpiAction;
  readonly isActive?: boolean;
};

export type OperationsOverviewCardViewData = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly action?: OperationsKpiAction;
};

/** Maps legacy KPI strip view-data to PG KPI card props for operations dashboard. */
export function buildOperationsKpiCards(kpis: KpiStripViewData): readonly OperationsKpiCardViewData[] {
  return Object.freeze([
    {
      id: 'cash',
      label: 'Verfügbar',
      value: kpis.availableCashLabel,
      trend: kpis.availableCashTrend,
      variant: 'info',
      action: 'finance',
    },
    {
      id: 'energy',
      label: 'Energie-Reserve',
      value: kpis.energyReserveLabel,
      trend: kpis.energyTrend,
      variant: kpis.energyHasDeficit ? 'danger' : 'success',
    },
    {
      id: 'transport',
      label: 'Transporte',
      value: String(kpis.activeTransportCount),
      trend: kpis.activeTransportTrend,
      variant: 'default',
      action: 'logistics',
      isActive: kpis.activeTransportCount > 0,
    },
    {
      id: 'warehouse',
      label: 'Im Lagerhaus',
      value: String(kpis.warehouseTotalUnits),
      hint: kpis.warehouseCapacityHint,
      variant: 'default',
      action: 'logistics',
    },
    {
      id: 'onsite',
      label: 'Am Standort',
      value: String(kpis.onSiteResourceLines),
      hint: kpis.onSiteHint,
      variant: 'default',
    },
    {
      id: 'employees',
      label: 'Mitarbeiter',
      value: `${kpis.assignedEmployeeCount}/${kpis.employeeCount}`,
      trend: kpis.payrollLabel,
      variant: 'default',
    },
    {
      id: 'price-index',
      label: 'Preisindex',
      value: kpis.priceIndexLabel,
      hint: kpis.priceIndexHint,
      variant: 'default',
    },
    {
      id: 'tax',
      label: 'Steuer / Verträge',
      value: kpis.corporateTaxRateLabel,
      trend: kpis.taxTrendLabel,
      variant: kpis.taxPaymentBlocked ? 'danger' : 'default',
    },
  ]);
}

/** Maps overview strip cards to PG operations overview cards. */
export function buildOperationsOverviewCards(
  overview: OverviewStripViewData,
): readonly OperationsOverviewCardViewData[] {
  return Object.freeze(
    overview.cards.map((card) =>
      Object.freeze({
        id: card.label.toLowerCase().replace(/\s+/g, '-'),
        label: card.label,
        value: card.value,
        hint: card.hint,
        action: card.label === 'Transport' ? ('logistics' as const) : undefined,
      }),
    ),
  );
}
