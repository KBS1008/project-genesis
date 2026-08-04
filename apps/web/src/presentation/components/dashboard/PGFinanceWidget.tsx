'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGFinanceRow = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

/** Finance summary widget (DB-005) or operations ledger table. */
export function PGFinanceWidget({
  title = 'Finanzen',
  subtitle,
  rows,
  transactions,
  ledgerRows,
  ledgerMode = false,
  onTransactionClick,
  selectedTransactionId,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Finanzdaten',
  emptyHint,
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows?: readonly PGFinanceRow[];
  readonly transactions?: readonly { readonly id: string; readonly cells: readonly string[] }[];
  readonly ledgerRows?: readonly PGOperationsTableRow[];
  readonly ledgerMode?: boolean;
  readonly onTransactionClick?: (transactionId: string) => void;
  readonly selectedTransactionId?: string | null;
  readonly emptyHint?: string;
}) {
  const summaryRows = rows ?? [];
  const ledgerTableRows = ledgerRows ?? [];
  const surfaceEmpty =
    ledgerMode
      ? ledgerTableRows.length === 0 && state === 'idle'
      : summaryRows.length === 0 && (transactions?.length ?? 0) === 0 && state === 'idle';

  return (
    <section className="pg-widget pg-finance-widget" aria-labelledby="pg-finance-widget-title">
      <h3 id="pg-finance-widget-title" className="pg-widget-title">
        {title}
      </h3>
      {subtitle !== undefined ? <p className="pg-widget-subtitle">{subtitle}</p> : null}
      <PGWidgetSurface
        state={surfaceEmpty ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
      >
        {ledgerMode ? (
          <PGOperationsTable
            columns={['Typ', 'Betrag', 'Saldo', 'Zeit']}
            columnCount={4}
            rows={ledgerTableRows}
            searchable
            searchPlaceholder="Buchungen suchen…"
            selectedRowId={selectedTransactionId}
            onRowClick={onTransactionClick}
            emptyTitle="Noch keine Buchungen."
            emptyHint="Bauen, handeln oder forschen, um Buchungen zu erzeugen."
            ariaLabel="Finanzbuchungen"
          />
        ) : (
          <>
            <ul className="pg-widget-metric-list">
              {summaryRows.map((row) => (
                <li key={row.id}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </li>
              ))}
            </ul>
            {transactions !== undefined && transactions.length > 0 ? (
              <QueryRows
                columns={['Typ', 'Betrag', 'Saldo']}
                columnCount={3}
                rows={transactions}
                selectedRowId={selectedTransactionId}
                onRowClick={onTransactionClick}
              />
            ) : null}
          </>
        )}
      </PGWidgetSurface>
    </section>
  );
}
