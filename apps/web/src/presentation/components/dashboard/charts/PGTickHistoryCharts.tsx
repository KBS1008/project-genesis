'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TickMetricsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGChartTooltip, PGChartTooltipValue } from '@/presentation/components/dashboard/charts/PGChartTooltip';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import {
  PG_CHART_AXIS_LINE,
  PG_CHART_AXIS_TICK,
  PG_CHART_GRID_STROKE,
} from '@/presentation/components/dashboard/charts/pg-chart-theme';

type MetricKey = 'availableCash' | 'energyReserve' | 'activeTransportCount';

type MetricChartConfig = {
  readonly key: MetricKey;
  readonly label: string;
  readonly color: string;
  readonly formatValue: (value: number) => string;
};

const METRIC_CHARTS: readonly MetricChartConfig[] = Object.freeze([
  {
    key: 'availableCash',
    label: 'Verfügbares Cash',
    color: 'var(--color-primary)',
    formatValue: (value) => `${value.toLocaleString('de-DE')} GC`,
  },
  {
    key: 'energyReserve',
    label: 'Energie-Reserve',
    color: 'var(--color-energy)',
    formatValue: (value) => `${value.toFixed(1)} MW`,
  },
  {
    key: 'activeTransportCount',
    label: 'Aktive Transporte',
    color: 'var(--color-info)',
    formatValue: (value) => String(value),
  },
]);

function MetricLineChart({
  config,
  points,
}: {
  readonly config: MetricChartConfig;
  readonly points: readonly TickMetricsViewData[];
}) {
  const data = points.map((point) => ({
    tickNumber: point.tickNumber,
    value: point[config.key],
  }));

  return (
    <PGChartWidget
      title={config.label}
      ariaLabel={config.label}
      pointCount={points.length}
      currentValue={config.formatValue(points.at(-1)?.[config.key] ?? 0)}
    >
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={PG_CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="tickNumber"
            tick={PG_CHART_AXIS_TICK}
            axisLine={PG_CHART_AXIS_LINE}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={PG_CHART_AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(value: number) =>
              config.key === 'availableCash' ? `${Math.round(value / 1000)}k` : String(value)
            }
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || payload === undefined || payload.length === 0) {
                return null;
              }

              return (
                <PGChartTooltip label={`Tick ${label ?? ''}`}>
                  <PGChartTooltipValue
                    name={config.label}
                    value={config.formatValue(Number(payload[0]?.value ?? 0))}
                  />
                </PGChartTooltip>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </PGChartWidget>
  );
}

/** Line charts for cash, energy reserve and active transports over simulation ticks. */
export function PGTickHistoryCharts({
  points,
}: {
  readonly points: readonly TickMetricsViewData[];
}) {
  if (points.length === 0) {
    return null;
  }

  return (
    <section className="pg-chart-strip" aria-label="Verlauf über Simulationsticks">
      {METRIC_CHARTS.map((config) => (
        <MetricLineChart key={config.key} config={config} points={points} />
      ))}
    </section>
  );
}
