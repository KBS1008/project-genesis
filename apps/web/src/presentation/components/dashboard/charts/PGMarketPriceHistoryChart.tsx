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
import type { TickMetricsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGChartTooltip, PGChartTooltipValue } from '@/presentation/components/dashboard/charts/PGChartTooltip';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import { pgChartResourceColor } from '@/presentation/components/dashboard/charts/pg-chart-resource-colors';
import {
  PG_CHART_AXIS_LINE,
  PG_CHART_AXIS_TICK,
  PG_CHART_GRID_STROKE,
  PG_CHART_LEGEND_STYLE,
} from '@/presentation/components/dashboard/charts/pg-chart-theme';

/** Multi-line chart of market prices per resource over simulation ticks. */
export function PGMarketPriceHistoryChart({
  points,
  labelResource,
}: {
  readonly points: readonly TickMetricsViewData[];
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
    <section className="pg-chart-strip pg-chart-strip-wide" aria-label="Marktpreisverlauf">
      <PGChartWidget
        title="Marktpreise"
        ariaLabel="Marktpreise"
        wide
        pointCount={points.length}
        emptyHint="Führen Sie Ticks aus — Preise passen sich alle 10 Ticks an Angebot und Nachfrage an."
        currentValue={
          latest !== undefined
            ? resourceIds
                .slice(0, 3)
                .map((resourceId) => {
                  const price = latest.marketPrices.find((entry) => entry.resourceId === resourceId);
                  return `${labelResource(resourceId)} ${(price?.lastPrice ?? 0).toLocaleString('de-DE')} GC`;
                })
                .join(' · ')
            : undefined
        }
      >
        <ResponsiveContainer width="100%" height={200}>
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
              width={52}
              tickFormatter={(value: number) => `${Math.round(value)}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || payload === undefined || payload.length === 0) {
                  return null;
                }

                return (
                  <PGChartTooltip label={`Tick ${label ?? ''}`}>
                    {payload.map((entry) => (
                      <PGChartTooltipValue
                        key={entry.name}
                        name={labelResource(String(entry.name ?? ''))}
                        value={`${(entry.value ?? 0).toLocaleString('de-DE')} GC`}
                        color={entry.color}
                      />
                    ))}
                  </PGChartTooltip>
                );
              }}
            />
            <Legend
              wrapperStyle={PG_CHART_LEGEND_STYLE}
              formatter={(value) => labelResource(String(value))}
            />
            {resourceIds.map((resourceId, index) => (
              <Line
                key={resourceId}
                type="monotone"
                dataKey={resourceId}
                name={resourceId}
                stroke={pgChartResourceColor(resourceId, index)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </PGChartWidget>
    </section>
  );
}
