'use client';

import type { ReactNode } from 'react';

/** Bottom status bar for simulation context and workspace metadata. */
export function PGStatusBar({
  left,
  center,
  right,
}: {
  readonly left?: ReactNode;
  readonly center?: ReactNode;
  readonly right?: ReactNode;
}) {
  return (
    <footer className="pg-status-bar" role="contentinfo" aria-label="Statusleiste">
      <div className="pg-status-bar-section">{left}</div>
      <div className="pg-status-bar-section pg-status-bar-center">{center}</div>
      <div className="pg-status-bar-section pg-status-bar-end">{right}</div>
    </footer>
  );
}
