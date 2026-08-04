'use client';

export type PGMarketTrend = 'UP' | 'DOWN' | 'STABLE';

function trendIcon(trend: PGMarketTrend): string {
  if (trend === 'UP') {
    return '▲';
  }

  if (trend === 'DOWN') {
    return '▼';
  }

  return '→';
}

/** Compact badge showing market price trend relative to the base price. */
export function PGMarketTrendBadge({
  trend,
  changePercent,
}: {
  readonly trend: PGMarketTrend;
  readonly changePercent: number;
}) {
  const className =
    trend === 'UP'
      ? 'pg-market-trend pg-market-trend-up'
      : trend === 'DOWN'
        ? 'pg-market-trend pg-market-trend-down'
        : 'pg-market-trend pg-market-trend-stable';

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
