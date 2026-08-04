'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MarketPriceChartViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGChartTooltip, PGChartTooltipValue } from '@/presentation/components/dashboard/charts/PGChartTooltip';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import {
  PG_CHART_AXIS_LINE,
  PG_CHART_AXIS_TICK,
  PG_CHART_GRID_STROKE,
  PG_CHART_LEGEND_STYLE,
} from '@/presentation/components/dashboard/charts/pg-chart-theme';

/** Grouped bar chart comparing aggregate supply and baseline demand per resource. */
export function PGMarketSupplyDemandChart({
  marketPrices,
}: {
  readonly marketPrices: readonly MarketPriceChartViewData[];
}) {
  if (marketPrices.length === 0) {
    return null;
  }

  const data = marketPrices.map((price) =>
    Object.freeze({
      resourceId: price.resourceId,
      resourceLabel: price.resourceLabel,
      Angebot: price.totalSupply,
      Nachfrage: price.baselineDemand,
    }),
  );

  const highestSupply = Math.max(...marketPrices.map((price) => price.totalSupply), 0);
  const highestDemand = Math.max(...marketPrices.map((price) => price.baselineDemand), 0);
  const summary = `${highestSupply.toLocaleString('de-DE')} max. Angebot · ${highestDemand.toLocaleString('de-DE')} Nachfrage-Basis`;

  return (
    <section className="pg-chart-strip pg-chart-strip-wide" aria-label="Angebot und Nachfrage">
      <PGChartWidget
        title="Angebot & Nachfrage"
        ariaLabel="Angebot und Nachfrage"
        wide
        pointCount={marketPrices.length}
        minPoints={1}
        currentValue={summary}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={PG_CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="resourceLabel"
              tick={PG_CHART_AXIS_TICK}
              axisLine={PG_CHART_AXIS_LINE}
              tickLine={false}
            />
            <YAxis tick={PG_CHART_AXIS_TICK} axisLine={false} tickLine={false} width={52} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || payload === undefined || payload.length === 0) {
                  return null;
                }

                return (
                  <PGChartTooltip label={String(label ?? '')}>
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
            <Bar
              dataKey="Angebot"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="Nachfrage"
              fill="var(--color-warning)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </PGChartWidget>
    </section>
  );
}
