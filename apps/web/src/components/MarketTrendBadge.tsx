'use client';

import type { MarketPriceReadModel } from '@/lib/api';

function trendIcon(trend: MarketPriceReadModel['trend']): string {
  if (trend === 'UP') {
    return '▲';
  }

  if (trend === 'DOWN') {
    return '▼';
  }

  return '→';
}

/** Compact badge showing market price trend relative to the base price. */
export function MarketTrendBadge({
  trend,
  changePercent,
}: {
  readonly trend: MarketPriceReadModel['trend'];
  readonly changePercent: number;
}) {
  const className =
    trend === 'UP'
      ? 'market-trend market-trend-up'
      : trend === 'DOWN'
        ? 'market-trend market-trend-down'
        : 'market-trend market-trend-stable';

  const label =
    trend === 'STABLE'
      ? 'Stabil'
      : `${changePercent > 0 ? '+' : ''}${changePercent.toLocaleString('de-DE')} %`;

  return (
    <span className={className}>
      {trendIcon(trend)} {label}
    </span>
  );
}
