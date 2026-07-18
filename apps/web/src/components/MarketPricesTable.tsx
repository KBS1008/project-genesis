'use client';

import { DataTable } from '@/components/DataTable';
import { MarketTrendBadge } from '@/components/MarketTrendBadge';
import type { MarketPriceReadModel } from '@/lib/api';

/** Sortable market overview table with supply, demand and trend columns. */
export function MarketPricesTable({
  marketPrices,
  labelResource,
}: {
  readonly marketPrices: readonly MarketPriceReadModel[];
  readonly labelResource: (id: string) => string;
}) {
  return (
    <DataTable
      searchable
      searchPlaceholder="Marktpreise suchen…"
      columns={[
        { key: 'resourceId', label: 'Ressource' },
        { key: 'lastPrice', label: 'Preis', numeric: true },
        { key: 'changePercent', label: 'Δ Basis', numeric: true },
        { key: 'totalSupply', label: 'Angebot', numeric: true },
        { key: 'baselineDemand', label: 'Nachfrage', numeric: true },
        { key: 'pressureIndex', label: 'Druck', numeric: true },
        { key: 'trend', label: 'Trend' },
        { key: 'tradeVolume', label: 'Volumen', numeric: true },
      ]}
      rows={marketPrices.map((price) => ({
        resourceId: labelResource(price.resourceId),
        lastPrice: price.lastPrice,
        changePercent: price.changePercent,
        totalSupply: price.totalSupply,
        baselineDemand: price.baselineDemand,
        pressureIndex: price.pressureIndex,
        trend: price.trend,
        tradeVolume: price.tradeVolume,
      }))}
      rowKeys={marketPrices.map((price) => `market:${price.resourceId}`)}
      emptyText="Keine Marktpreise geladen."
      renderCell={(key, row) => {
        const price = marketPrices.find(
          (entry) => labelResource(entry.resourceId) === row.resourceId,
        );

        if (price === undefined) {
          return row[key];
        }

        if (key === 'lastPrice') {
          return `${price.lastPrice.toLocaleString('de-DE')} GC`;
        }

        if (key === 'changePercent') {
          return `${price.changePercent > 0 ? '+' : ''}${price.changePercent.toLocaleString('de-DE')} %`;
        }

        if (key === 'pressureIndex') {
          return price.pressureIndex.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }

        if (key === 'trend') {
          return <MarketTrendBadge trend={price.trend} changePercent={price.changePercent} />;
        }

        return row[key];
      }}
    />
  );
}
