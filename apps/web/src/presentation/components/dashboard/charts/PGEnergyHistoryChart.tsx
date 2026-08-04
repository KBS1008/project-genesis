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

/** Dual-line chart comparing energy generation and consumption over simulation ticks. */
export function PGEnergyHistoryChart({
  points,
}: {
  readonly points: readonly TickMetricsViewData[];
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
    <section className="pg-chart-strip pg-chart-strip-wide" aria-label="Energieverlauf">
      <PGChartWidget
        title="Energie Erzeugung & Verbrauch"
        ariaLabel="Energie Erzeugung und Verbrauch"
        wide
        pointCount={points.length}
        emptyHint="Führen Sie Simulation-Ticks aus, um Energie-Trends zu sehen."
        currentValue={
          latest !== undefined
            ? `Erzeugung ${latest.energyGeneration.toFixed(1)} MW · Verbrauch ${latest.energyConsumption.toFixed(1)} MW · Reserve ${latest.energyReserve.toFixed(1)} MW`
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
              width={48}
              tickFormatter={(value: number) => `${value.toFixed(0)}`}
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
                        name={String(entry.name ?? '')}
                        value={`${(entry.value ?? 0).toFixed(1)} MW`}
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
      </PGChartWidget>
    </section>
  );
}
