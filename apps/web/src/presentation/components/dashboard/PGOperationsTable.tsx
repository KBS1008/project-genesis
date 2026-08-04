'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

export type PGOperationsTableRow = {
  readonly id: string;
  readonly cells: readonly (string | ReactNode)[];
  readonly searchText: string;
};

/** Searchable operations table built on the PG query-row pattern. */
export function PGOperationsTable({
  columns,
  rows,
  columnCount = columns.length,
  searchable = false,
  searchPlaceholder = 'Tabelle durchsuchen…',
  selectedRowId,
  onRowClick,
  emptyTitle = 'Keine Daten vorhanden.',
  emptyHint,
  filteredEmptyTitle = 'Keine Treffer für die Suche.',
  ariaLabel = 'Operations-Tabelle',
}: {
  readonly columns: readonly string[];
  readonly rows: readonly PGOperationsTableRow[];
  readonly columnCount?: number;
  readonly searchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly selectedRowId?: string | null;
  readonly onRowClick?: (rowId: string) => void;
  readonly emptyTitle?: string;
  readonly emptyHint?: string;
  readonly filteredEmptyTitle?: string;
  readonly ariaLabel?: string;
}) {
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || normalizedQuery.length === 0) {
      return rows;
    }

    return rows.filter((row) => row.searchText.toLowerCase().includes(normalizedQuery));
  }, [query, rows, searchable]);

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} hint={emptyHint} />;
  }

  return (
    <div className="pg-operations-table">
      {searchable ? (
        <label className="pg-operations-table-search">
          <span className="pg-operations-table-search-label">Suche</span>
          <input
            type="search"
            className="pg-operations-table-search-input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </label>
      ) : null}
      {filteredRows.length === 0 ? (
        <EmptyState title={filteredEmptyTitle} />
      ) : (
        <QueryRows
          columns={columns}
          columnCount={columnCount}
          rows={filteredRows}
          selectedRowId={selectedRowId}
          onRowClick={onRowClick}
          ariaLabel={ariaLabel}
        />
      )}
    </div>
  );
}
