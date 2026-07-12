'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TickMetricsSnapshot } from '@/lib/api';

function EnergyTooltip({
  active,
  payload,
  label,
}: {
  readonly active?: boolean;
  readonly payload?: ReadonlyArray<{
    readonly name?: string;
    readonly value?: number;
    readonly color?: string;
  }>;
  readonly label?: string | number;
}) {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">Tick {label}</span>
      {payload.map((entry) => (
        <strong key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {(entry.value ?? 0).toFixed(1)} MW
        </strong>
      ))}
    </div>
  );
}

/** Dual-line chart comparing energy generation and consumption over simulation ticks. */
export function EnergyHistoryChart({
  points,
}: {
  readonly points: readonly TickMetricsSnapshot[];
}) {
  if (points.length === 0) {
    return null;
  }

  const data = points.map((point) => ({
    tickNumber: point.tickNumber,
    energyGeneration: point.energyGeneration,
    energyConsumption: point.energyConsumption,
    energyReserve: point.energyReserve,
  }));
  const latest = points.at(-1);

  return (
    <section className="chart-strip inventory-chart-strip" aria-label="Energieverlauf">
      <article className="chart-card chart-card-wide">
        <header className="chart-card-header">
          <h3>Energie Erzeugung &amp; Verbrauch</h3>
          {latest !== undefined ? (
            <span className="chart-current-value">
              Erzeugung {latest.energyGeneration.toFixed(1)} MW · Verbrauch{' '}
              {latest.energyConsumption.toFixed(1)} MW · Reserve{' '}
              {latest.energyReserve.toFixed(1)} MW
            </span>
          ) : null}
        </header>
        {points.length < 2 ? (
          <p className="empty-state">
            <strong>Noch zu wenig Verlauf.</strong>
            Führen Sie Simulation-Ticks aus, um Energie-Trends zu sehen.
          </p>
        ) : (
          <div className="chart-canvas">
            <ResponsiveContainer width="100%" height={200}>
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
                  tickFormatter={(value: number) => `${value.toFixed(0)}`}
                />
                <Tooltip content={<EnergyTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="energyGeneration"
                  name="Erzeugung"
                  stroke="var(--color-success)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="energyConsumption"
                  name="Verbrauch"
                  stroke="var(--color-warning)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="energyReserve"
                  name="Reserve"
                  stroke="var(--color-energy)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>
    </section>
  );
}
