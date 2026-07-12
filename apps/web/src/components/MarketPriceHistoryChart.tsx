'use client';

import { useMemo } from 'react';
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

const RESOURCE_COLORS: Record<string, string> = {
  wood: 'var(--color-primary)',
  planks: '#b45309',
  steel: '#64748b',
  iron_ore: '#78716c',
};

function resourceColor(resourceId: string, index: number): string {
  return RESOURCE_COLORS[resourceId] ?? `hsl(${(index * 67) % 360} 55% 45%)`;
}

function MarketTooltip({
  active,
  payload,
  label,
  labelResource,
}: {
  readonly active?: boolean;
  readonly payload?: ReadonlyArray<{
    readonly name?: string;
    readonly value?: number;
    readonly color?: string;
  }>;
  readonly label?: string | number;
  readonly labelResource: (id: string) => string;
}) {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">Tick {label}</span>
      {payload.map((entry) => (
        <strong key={entry.name} style={{ color: entry.color }}>
          {labelResource(String(entry.name ?? ''))}:{' '}
          {(entry.value ?? 0).toLocaleString('de-DE')} GC
        </strong>
      ))}
    </div>
  );
}

/** Multi-line chart of market prices per resource over simulation ticks. */
export function MarketPriceHistoryChart({
  points,
  labelResource,
}: {
  readonly points: readonly TickMetricsSnapshot[];
  readonly labelResource: (id: string) => string;
}) {
  const resourceIds = useMemo(
    () => [
      ...new Set(points.flatMap((point) => point.marketPrices.map((entry) => entry.resourceId))),
    ],
    [points],
  );

  const data = useMemo(
    () =>
      points.map((point) => {
        const prices = Object.fromEntries(
          point.marketPrices.map((entry) => [entry.resourceId, entry.lastPrice]),
        );

        return Object.freeze({
          tickNumber: point.tickNumber,
          ...prices,
        });
      }),
    [points],
  );

  if (points.length === 0 || resourceIds.length === 0) {
    return null;
  }

  const latest = points.at(-1);

  return (
    <section className="chart-strip inventory-chart-strip" aria-label="Marktpreisverlauf">
      <article className="chart-card chart-card-wide">
        <header className="chart-card-header">
          <h3>Marktpreise</h3>
          {latest !== undefined ? (
            <span className="chart-current-value">
              {resourceIds
                .slice(0, 3)
                .map((resourceId) => {
                  const price = latest.marketPrices.find((entry) => entry.resourceId === resourceId);
                  return `${labelResource(resourceId)} ${(price?.lastPrice ?? 0).toLocaleString('de-DE')}`;
                })
                .join(' · ')}
            </span>
          ) : null}
        </header>
        {points.length < 2 ? (
          <p className="empty-state">
            <strong>Noch zu wenig Verlauf.</strong>
            Führen Sie Ticks aus oder handeln Sie am Markt, um Preistrends zu sehen.
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
                  width={52}
                  tickFormatter={(value: number) => `${Math.round(value)}`}
                />
                <Tooltip content={<MarketTooltip labelResource={labelResource} />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => labelResource(String(value))}
                />
                {resourceIds.map((resourceId, index) => (
                  <Line
                    key={resourceId}
                    type="monotone"
                    dataKey={resourceId}
                    name={resourceId}
                    stroke={resourceColor(resourceId, index)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>
    </section>
  );
}
