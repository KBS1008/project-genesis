'use client';

import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
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

/** Multi-line chart of market pressure (demand/supply ratio) over simulation ticks. */
export function PGMarketPressureHistoryChart({
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
        const pressure = Object.fromEntries(
          point.marketPrices.map((entry) => [entry.resourceId, entry.pressureIndex]),
        );

        return Object.freeze({
          tickNumber: point.tickNumber,
          ...pressure,
        });
      }),
    [points],
  );

  if (points.length === 0 || resourceIds.length === 0) {
    return null;
  }

  const latest = points.at(-1);
  const latestPressure = latest?.marketPrices
    .slice(0, 3)
    .map(
      (entry) =>
        `${labelResource(entry.resourceId)} ${entry.pressureIndex.toLocaleString('de-DE')}`,
    )
    .join(' · ');

  return (
    <section className="pg-chart-strip pg-chart-strip-wide" aria-label="Marktdruck-Verlauf">
      <PGChartWidget
        title="Marktdruck"
        ariaLabel="Marktdruck"
        wide
        pointCount={points.length}
        emptyHint="Führen Sie Ticks aus, um den Druckindex (Nachfrage/Angebot) zu verfolgen."
        currentValue={latestPressure !== undefined && latestPressure.length > 0 ? latestPressure : undefined}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={PG_CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
            <ReferenceLine y={1} stroke="var(--muted)" strokeDasharray="4 4" />
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
              domain={[0, 'auto']}
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
                        value={(entry.value ?? 0).toLocaleString('de-DE')}
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
