'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGSupplyChainRow = {
  readonly id: string;
  readonly routeLabel: string;
  readonly resourceLabel: string;
  readonly amountLabel: string;
  readonly statusLabel: string;
  readonly progressLabel: string;
  readonly recipeLabel?: string;
  readonly durationLabel?: string;
};

/** Supply chain / transport widget (DB-008). */
export function PGSupplyChainWidget({
  title = 'Lieferkette',
  activeCount,
  hint,
  orders,
  onOrderClick,
  selectedOrderId,
  detailed = false,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine aktiven Transporte',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly activeCount: number;
  readonly hint?: string;
  readonly orders: readonly PGSupplyChainRow[];
  readonly onOrderClick?: (orderId: string) => void;
  readonly selectedOrderId?: string | null;
  readonly detailed?: boolean;
}) {
  return (
    <section className="pg-widget pg-supply-chain-widget" aria-labelledby="pg-supply-chain-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-supply-chain-widget-title" className="pg-widget-title">
          {title}
        </h3>
        <span className="pg-widget-badge">{activeCount}</span>
      </div>
      {hint !== undefined ? <p className="pg-widget-subtitle">{hint}</p> : null}
      <PGWidgetSurface
        state={orders.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
      >
        <QueryRows
          columns={
            detailed
              ? ['Ressource', 'Menge', 'Route', 'Produktion', 'Status', 'Dauer (Ticks)', 'Fortschritt']
              : ['Route', 'Ressource', 'Menge', 'Status', 'Fortschritt']
          }
          columnCount={detailed ? 7 : 5}
          rows={orders.map((order) => ({
            id: order.id,
            cells: detailed
              ? [
                  order.resourceLabel,
                  order.amountLabel,
                  order.routeLabel,
                  order.recipeLabel ?? '—',
                  order.statusLabel,
                  order.durationLabel ?? '—',
                  order.progressLabel,
                ]
              : [
                  order.routeLabel,
                  order.resourceLabel,
                  order.amountLabel,
                  order.statusLabel,
                  order.progressLabel,
                ],
          }))}
          selectedRowId={selectedOrderId}
          onRowClick={onOrderClick}
        />
      </PGWidgetSurface>
    </section>
  );
}
