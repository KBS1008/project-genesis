/**
 * @module @application/read-models/TickMetricsSnapshot
 *
 * Slim per-tick metrics captured for dashboard time-series charts.
 */

/** One recorded simulation tick for chart rendering. */
export type TickMetricsSnapshot = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly availableCash: number;
  readonly energyReserve: number;
  readonly activeTransportCount: number;
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
