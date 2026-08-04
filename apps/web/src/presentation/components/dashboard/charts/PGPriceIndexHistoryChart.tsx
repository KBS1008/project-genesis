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
import type { TickMetricsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGChartTooltip, PGChartTooltipValue } from '@/presentation/components/dashboard/charts/PGChartTooltip';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import {
  PG_CHART_AXIS_LINE,
  PG_CHART_AXIS_TICK,
  PG_CHART_GRID_STROKE,
} from '@/presentation/components/dashboard/charts/pg-chart-theme';

/** Line chart of the global price index over simulation ticks. */
export function PGPriceIndexHistoryChart({
  points,
}: {
  readonly points: readonly TickMetricsViewData[];
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
    <section className="pg-chart-strip pg-chart-strip-wide" aria-label="Preisindex-Verlauf">
      <PGChartWidget
        title="Preisindex"
        ariaLabel="Preisindex"
        wide
        pointCount={points.length}
        emptyHint="Führen Sie Ticks aus, um die Inflationssignale zu verfolgen."
        currentValue={`${latest.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (neutral 1,00)`}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={PG_CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
            <ReferenceLine y={1} stroke="var(--muted)" strokeDasharray="4 4" label="" />
            <ReferenceLine y={0.9} stroke="var(--border)" strokeDasharray="2 6" />
            <ReferenceLine y={1.1} stroke="var(--border)" strokeDasharray="2 6" />
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
              domain={[0.7, 'auto']}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || payload === undefined || payload.length === 0) {
                  return null;
                }

                const value = payload[0]?.value ?? 1;

                return (
                  <PGChartTooltip label={`Tick ${label ?? ''}`}>
                    <PGChartTooltipValue
                      name="Preisindex"
                      value={value.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    />
                  </PGChartTooltip>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="priceIndex"
              name="Preisindex"
              stroke="var(--color-warning)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </PGChartWidget>
    </section>
  );
}
