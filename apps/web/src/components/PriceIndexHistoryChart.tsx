'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TickMetricsSnapshot } from '@/lib/api';

function IndexTooltip({
  active,
  payload,
  label,
}: {
  readonly active?: boolean;
  readonly payload?: ReadonlyArray<{ readonly value?: number }>;
  readonly label?: string | number;
}) {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }

  const value = payload[0]?.value ?? 1;

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">Tick {label}</span>
      <strong>
        {value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </strong>
    </div>
  );
}

/** Line chart of the global price index (average lastPrice/basePrice) over simulation ticks. */
export function PriceIndexHistoryChart({
  points,
}: {
  readonly points: readonly TickMetricsSnapshot[];
}) {
  if (points.length === 0) {
    return null;
  }

  const data = points.map((point) =>
    Object.freeze({
      tickNumber: point.tickNumber,
      priceIndex: point.priceIndex,
    }),
  );

  const latest = points.at(-1)?.priceIndex ?? 1;

  return (
    <section className="chart-strip inventory-chart-strip" aria-label="Preisindex-Verlauf">
      <article className="chart-card chart-card-wide">
        <header className="chart-card-header">
          <h3>Preisindex</h3>
          <span className="chart-current-value">
            {latest.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            (neutral 1,00)
          </span>
        </header>
        {points.length < 2 ? (
          <p className="empty-state">
            <strong>Noch zu wenig Verlauf.</strong>
            Führen Sie Ticks aus, um die Inflationssignale zu verfolgen.
          </p>
        ) : (
          <div className="chart-canvas">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-panel)" strokeDasharray="3 3" vertical={false} />
                <ReferenceLine y={1} stroke="var(--muted)" strokeDasharray="4 4" label="" />
                <ReferenceLine y={0.9} stroke="var(--border)" strokeDasharray="2 6" />
                <ReferenceLine y={1.1} stroke="var(--border)" strokeDasharray="2 6" />
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
                  width={52}
                  domain={[0.7, 'auto']}
                />
                <Tooltip content={<IndexTooltip />} />
                <Line
                  type="monotone"
                  dataKey="priceIndex"
                  name="Preisindex"
                  stroke="var(--color-warning, #ca8a04)"
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
