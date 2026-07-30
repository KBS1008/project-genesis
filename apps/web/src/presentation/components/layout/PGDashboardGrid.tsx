'use client';

import type { ReactNode } from 'react';

/** Responsive 12-column dashboard grid container. */
export function PGDashboardGrid({ children }: { readonly children: ReactNode }) {
  return <div className="pg-dashboard-grid">{children}</div>;
}

/** Grid cell with span control for dashboard layouts. */
export function PGDashboardGridItem({
  children,
  span = 4,
  className = '',
}: {
  readonly children: ReactNode;
  readonly span?: 3 | 4 | 6 | 8 | 12;
  readonly className?: string;
}) {
  return (
    <div className={`pg-dashboard-grid-item pg-dashboard-span-${span} ${className}`.trim()}>{children}</div>
  );
}

/** Workspace frame with optional inspector column. */
export function PGWorkspaceFrame({
  children,
  inspector,
}: {
  readonly children: ReactNode;
  readonly inspector?: ReactNode;
}) {
  return (
    <div className={`pg-workspace-frame${inspector !== undefined ? ' pg-workspace-frame-with-inspector' : ''}`.trim()}>
      <div className="pg-workspace-frame-main">{children}</div>
      {inspector !== undefined ? <div className="pg-workspace-frame-inspector">{inspector}</div> : null}
    </div>
  );
}
