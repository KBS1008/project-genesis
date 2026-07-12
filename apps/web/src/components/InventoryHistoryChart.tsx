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

function InventoryTooltip({
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
          {entry.name}: {entry.value?.toLocaleString('de-DE') ?? 0} Einheiten
        </strong>
      ))}
    </div>
  );
}

/** Dual-line chart comparing on-site and warehouse inventory over simulation ticks. */
export function InventoryHistoryChart({
  points,
}: {
  readonly points: readonly TickMetricsSnapshot[];
}) {
  if (points.length === 0) {
    return null;
  }

  const data = points.map((point) => ({
    tickNumber: point.tickNumber,
    onSiteTotalUnits: point.onSiteTotalUnits,
    warehouseTotalUnits: point.warehouseTotalUnits,
  }));
  const latest = points.at(-1);

  return (
    <section className="chart-strip inventory-chart-strip" aria-label="Lagerbestandsverlauf">
      <article className="chart-card chart-card-wide">
        <header className="chart-card-header">
          <h3>Lagerbestände</h3>
          {latest !== undefined ? (
            <span className="chart-current-value">
              Standort {latest.onSiteTotalUnits.toLocaleString('de-DE')} · Lagerhaus{' '}
              {latest.warehouseTotalUnits.toLocaleString('de-DE')}
            </span>
          ) : null}
        </header>
        {points.length < 2 ? (
          <p className="empty-state">
            <strong>Noch zu wenig Verlauf.</strong>
            Führen Sie Simulation-Ticks aus, um Lager-Trends zu sehen.
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
                />
                <Tooltip content={<InventoryTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="onSiteTotalUnits"
                  name="Am Standort"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="warehouseTotalUnits"
                  name="Im Lagerhaus"
                  stroke="var(--color-info)"
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
    </section>
  );
}
