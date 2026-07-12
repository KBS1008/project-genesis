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
import type { TickMetricsSnapshot } from '@/lib/api';

type MetricKey = 'availableCash' | 'energyReserve' | 'activeTransportCount';

type MetricChartConfig = {
  readonly key: MetricKey;
  readonly label: string;
  readonly color: string;
  readonly unit: string;
  readonly formatValue: (value: number) => string;
};

const METRIC_CHARTS: readonly MetricChartConfig[] = [
  {
    key: 'availableCash',
    label: 'Verfügbares Cash',
    color: 'var(--color-primary)',
    unit: 'GC',
    formatValue: (value) => `${value.toLocaleString('de-DE')} GC`,
  },
  {
    key: 'energyReserve',
    label: 'Energie-Reserve',
    color: 'var(--color-energy)',
    unit: 'MW',
    formatValue: (value) => `${value.toFixed(1)} MW`,
  },
  {
    key: 'activeTransportCount',
    label: 'Aktive Transporte',
    color: 'var(--color-info)',
    unit: '',
    formatValue: (value) => String(value),
  },
];

function ChartTooltip({
  active,
  payload,
  label,
  config,
}: {
  readonly active?: boolean;
  readonly payload?: ReadonlyArray<{ readonly value?: number }>;
  readonly label?: string | number;
  readonly config: MetricChartConfig;
}) {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }

  const value = payload[0]?.value ?? 0;

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">Tick {label}</span>
      <strong>{config.formatValue(value)}</strong>
    </div>
  );
}

function MetricLineChart({
  config,
  points,
}: {
  readonly config: MetricChartConfig;
  readonly points: readonly TickMetricsSnapshot[];
}) {
  const data = points.map((point) => ({
    tickNumber: point.tickNumber,
    value: point[config.key],
  }));

  return (
    <article className="chart-card">
      <header className="chart-card-header">
        <h3>{config.label}</h3>
        {points.length > 0 ? (
          <span className="chart-current-value">
            {config.formatValue(points.at(-1)?.[config.key] ?? 0)}
          </span>
        ) : null}
      </header>
      {points.length < 2 ? (
        <p className="empty-state">
          <strong>Noch zu wenig Verlauf.</strong>
          Führen Sie Simulation-Ticks aus, um Trends zu sehen.
        </p>
      ) : (
        <div className="chart-canvas" aria-hidden={false}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-panel)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="tickNumber"
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(value: number) =>
                  config.key === 'availableCash'
                    ? `${Math.round(value / 1000)}k`
                    : String(value)
                }
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    payload={props.payload as ReadonlyArray<{ readonly value?: number }>}
                    label={props.label}
                    config={config}
                  />
                )}
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
        </div>
      )}
    </article>
  );
}

/** Line charts for cash, energy reserve and active transports over simulation ticks. */
export function TickHistoryCharts({
  points,
}: {
  readonly points: readonly TickMetricsSnapshot[];
}) {
  if (points.length === 0) {
    return null;
  }

  return (
    <section className="chart-strip" aria-label="Verlauf über Simulationsticks">
      {METRIC_CHARTS.map((config) => (
        <MetricLineChart key={config.key} config={config} points={points} />
      ))}
    </section>
  );
}
