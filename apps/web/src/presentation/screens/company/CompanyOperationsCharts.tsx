'use client';

import type {
  CompanyDashboardViewData,
  ContentLabelsViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  PGEnergyHistoryChart,
  PGInventoryHistoryChart,
  PGMarketPressureHistoryChart,
  PGMarketPriceHistoryChart,
  PGMarketSupplyDemandChart,
  PGPriceIndexHistoryChart,
  PGTickHistoryCharts,
} from '@/presentation/components/dashboard/charts';

/** PG chart stack for the company operations dashboard (S8). */
export function CompanyOperationsCharts({
  companyViewData,
  hasGame,
}: {
  readonly companyViewData: CompanyDashboardViewData;
  readonly hasGame: boolean;
}) {
  if (!hasGame) {
    return null;
  }

  const { chartPoints, marketPrices, labels } = companyViewData;

  return (
    <div className="pg-operations-charts">
      <PGTickHistoryCharts points={chartPoints} />
      <PGInventoryHistoryChart points={chartPoints} />
      <PGEnergyHistoryChart points={chartPoints} />
      <PGMarketPriceHistoryChart points={chartPoints} labelResource={labels.resource} />
      <PGMarketSupplyDemandChart marketPrices={marketPrices} />
      <PGMarketPressureHistoryChart points={chartPoints} labelResource={labels.resource} />
      <PGPriceIndexHistoryChart points={chartPoints} />
    </div>
  );
}

/** Compact executive chart row (cash/energy/transport + energy + market prices). */
export function ExecutiveDashboardCharts({
  chartPoints,
  marketPrices,
  labels,
}: {
  readonly chartPoints: CompanyDashboardViewData['chartPoints'];
  readonly marketPrices: CompanyDashboardViewData['marketPrices'];
  readonly labels: ContentLabelsViewData;
}) {
  if (chartPoints.length === 0) {
    return null;
  }

  return (
    <section className="pg-executive-charts" aria-label="Simulationsverläufe">
      <PGTickHistoryCharts points={chartPoints} />
      <PGEnergyHistoryChart points={chartPoints} />
      <PGMarketPriceHistoryChart points={chartPoints} labelResource={labels.resource} />
      <PGMarketSupplyDemandChart marketPrices={marketPrices} />
      <PGPriceIndexHistoryChart points={chartPoints} />
    </section>
  );
}
