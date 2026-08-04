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
import type { TickMetricsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGChartTooltip, PGChartTooltipValue } from '@/presentation/components/dashboard/charts/PGChartTooltip';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import {
  PG_CHART_AXIS_LINE,
  PG_CHART_AXIS_TICK,
  PG_CHART_GRID_STROKE,
  PG_CHART_LEGEND_STYLE,
} from '@/presentation/components/dashboard/charts/pg-chart-theme';

/** Dual-line chart comparing on-site and warehouse inventory over simulation ticks. */
export function PGInventoryHistoryChart({
  points,
}: {
  readonly points: readonly TickMetricsViewData[];
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
    <section className="pg-chart-strip pg-chart-strip-wide" aria-label="Lagerbestandsverlauf">
      <PGChartWidget
        title="Lagerbestände"
        ariaLabel="Lagerbestände"
        wide
        pointCount={points.length}
        emptyHint="Führen Sie Simulation-Ticks aus, um Lager-Trends zu sehen."
        currentValue={
          latest !== undefined
            ? `Standort ${latest.onSiteTotalUnits.toLocaleString('de-DE')} · Lagerhaus ${latest.warehouseTotalUnits.toLocaleString('de-DE')}`
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
            <YAxis tick={PG_CHART_AXIS_TICK} axisLine={false} tickLine={false} width={48} />
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
                        name={String(entry.name ?? '')}
                        value={`${(entry.value ?? 0).toLocaleString('de-DE')} Einheiten`}
                        color={entry.color}
                      />
                    ))}
                  </PGChartTooltip>
                );
              }}
            />
            <Legend wrapperStyle={PG_CHART_LEGEND_STYLE} />
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
      </PGChartWidget>
    </section>
  );
}
