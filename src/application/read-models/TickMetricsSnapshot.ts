/**
 * @module @application/read-models/TickMetricsSnapshot
 *
 * Slim per-tick metrics captured for dashboard time-series charts.
 */

/** Slim market price sample captured per simulation tick. */
export type TickMarketPriceSnapshot = {
  readonly resourceId: string;
  readonly lastPrice: number;
};

/** One recorded simulation tick for chart rendering. */
export type TickMetricsSnapshot = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly availableCash: number;
  readonly energyReserve: number;
  readonly energyGeneration: number;
  readonly energyConsumption: number;
  readonly activeTransportCount: number;
  readonly warehouseTotalUnits: number;
  readonly onSiteTotalUnits: number;
  readonly marketPrices: readonly TickMarketPriceSnapshot[];
};

/** Tick history returned to the dashboard shell. */
export type DashboardTickHistory = {
  readonly companyId: string | null;
  readonly points: readonly TickMetricsSnapshot[];
};

/** Options for querying stored tick metrics. */
export type TickHistoryQuery = {
  readonly fromTick?: number;
  readonly toTick?: number;
  readonly limit?: number;
};
