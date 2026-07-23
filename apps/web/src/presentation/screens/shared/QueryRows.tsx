'use client';

import { EmptyState } from '@/presentation/primitives/EmptyState';

/** Tabular read-only query results for M9 inspection screens. */
export function QueryRows({
  rows,
  columns,
  onRowClick,
  selectedRowId,
}: {
  readonly rows: readonly { readonly id: string; readonly cells: readonly string[] }[];
  readonly columns: readonly string[];
  readonly onRowClick?: (rowId: string) => void;
  readonly selectedRowId?: string | null;
}) {
  if (rows.length === 0) {
    return <EmptyState title="Keine Daten vorhanden." />;
  }

  return (
    <div className="pg-query-table" role="table" aria-label="Abfrageergebnisse">
      <div className="pg-query-row pg-query-header" role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
      </div>
      {rows.map((row) => {
        const isSelected = selectedRowId === row.id;
        const className = `pg-query-row${isSelected ? ' is-selected' : ''}${onRowClick ? ' is-clickable' : ''}`.trim();

        if (onRowClick) {
          return (
            <button
              key={row.id}
              type="button"
              className={className}
              role="row"
              aria-current={isSelected ? 'true' : undefined}
              onClick={() => {
                onRowClick(row.id);
              }}
            >
              {row.cells.map((cell, index) => (
                <span key={`${row.id}-${index}`} role="cell">
                  {cell}
                </span>
              ))}
            </button>
          );
        }

        return (
          <div key={row.id} className={className} role="row">
            {row.cells.map((cell, index) => (
              <span key={`${row.id}-${index}`} role="cell">
                {cell}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
