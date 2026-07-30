'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGFinanceRow = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

/** Finance summary widget (DB-005). */
export function PGFinanceWidget({
  title = 'Finanzen',
  rows,
  transactions,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Finanzdaten',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly rows: readonly PGFinanceRow[];
  readonly transactions?: readonly { readonly id: string; readonly cells: readonly string[] }[];
}) {
  return (
    <section className="pg-widget pg-finance-widget" aria-labelledby="pg-finance-widget-title">
      <h3 id="pg-finance-widget-title" className="pg-widget-title">
        {title}
      </h3>
      <PGWidgetSurface
        state={rows.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
      >
        <ul className="pg-widget-metric-list">
          {rows.map((row) => (
            <li key={row.id}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </li>
          ))}
        </ul>
        {transactions !== undefined && transactions.length > 0 ? (
          <QueryRows columns={['Typ', 'Betrag', 'Saldo']} rows={transactions} />
        ) : null}
      </PGWidgetSurface>
    </section>
  );
}
