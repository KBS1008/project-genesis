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
import type { MarketPriceReadModel } from '@/lib/api';

function SupplyDemandTooltip({
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
      <span className="chart-tooltip-label">{labelResource(String(label ?? ''))}</span>
      {payload.map((entry) => (
        <strong key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {(entry.value ?? 0).toLocaleString('de-DE')} Einheiten
        </strong>
      ))}
    </div>
  );
}

/** Grouped bar chart comparing aggregate supply and baseline demand per resource. */
export function MarketSupplyDemandChart({
  marketPrices,
  labelResource,
}: {
  readonly marketPrices: readonly MarketPriceReadModel[];
  readonly labelResource: (id: string) => string;
}) {
  if (marketPrices.length === 0) {
    return null;
  }

  const data = marketPrices.map((price) =>
    Object.freeze({
      resourceId: price.resourceId,
      Angebot: price.totalSupply,
      Nachfrage: price.baselineDemand,
    }),
  );

  const highestSupply = Math.max(...marketPrices.map((price) => price.totalSupply), 0);
  const highestDemand = Math.max(...marketPrices.map((price) => price.baselineDemand), 0);
  const summary = `${highestSupply.toLocaleString('de-DE')} max. Angebot · ${highestDemand.toLocaleString('de-DE')} Nachfrage-Basis`;

  return (
    <section className="chart-strip inventory-chart-strip" aria-label="Angebot und Nachfrage">
      <article className="chart-card chart-card-wide">
        <header className="chart-card-header">
          <h3>Angebot &amp; Nachfrage</h3>
          <span className="chart-current-value">{summary}</span>
        </header>
        <div className="chart-canvas">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-panel)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="resourceId"
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                tickFormatter={(value: string) => labelResource(value)}
              />
              <YAxis
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                content={<SupplyDemandTooltip labelResource={labelResource} />}
                labelFormatter={(value) => labelResource(String(value))}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="Angebot"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="Nachfrage"
                fill="#b45309"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
