'use client';

import type { ReactNode } from 'react';

/** Accessible chart tooltip shell using PG chart tokens. */
export function PGChartTooltip({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="pg-chart-tooltip">
      <span className="pg-chart-tooltip-label">{label}</span>
      {children}
    </div>
  );
}

export function PGChartTooltipValue({
  name,
  value,
  color,
}: {
  readonly name: string;
  readonly value: string;
  readonly color?: string;
}) {
  return (
    <strong style={color !== undefined ? { color } : undefined}>
      {name}: {value}
    </strong>
  );
}
