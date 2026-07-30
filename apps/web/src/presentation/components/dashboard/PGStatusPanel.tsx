'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';

export type PGStatusPanelItem = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

/** Status summary panel (DB-003). */
export function PGStatusPanel({
  title = 'Status',
  items,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Kein Status verfügbar',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly items: readonly PGStatusPanelItem[];
}) {
  return (
    <section className="pg-widget pg-status-panel" aria-labelledby="pg-status-panel-title">
      <h3 id="pg-status-panel-title" className="pg-widget-title">
        {title}
      </h3>
      <PGWidgetSurface
        state={items.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
      >
        <ul className="pg-status-panel-list">
          {items.map((item) => (
            <li key={item.id} className={`pg-status-panel-item pg-tone-${item.tone ?? 'default'}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
      </PGWidgetSurface>
    </section>
  );
}
