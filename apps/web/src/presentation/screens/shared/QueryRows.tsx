'use client';

import type { ReactNode } from 'react';
import { EmptyState } from '@/presentation/primitives/EmptyState';

/** Tabular read-only query results for M9 inspection screens. */
export function QueryRows({
  rows,
  columns,
  columnCount = columns.length,
  onRowClick,
  selectedRowId,
  ariaLabel = 'Abfrageergebnisse',
}: {
  readonly rows: readonly { readonly id: string; readonly cells: readonly (string | ReactNode)[] }[];
  readonly columns: readonly string[];
  readonly columnCount?: number;
  readonly onRowClick?: (rowId: string) => void;
  readonly selectedRowId?: string | null;
  readonly ariaLabel?: string;
}) {
  if (rows.length === 0) {
    return <EmptyState title="Keine Daten vorhanden." />;
  }

  const gridStyle = { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` };

  return (
    <div className="pg-query-table" role="table" aria-label={ariaLabel}>
      <div className="pg-query-row pg-query-header" role="row" style={gridStyle}>
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
              style={gridStyle}
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
          <div key={row.id} className={className} role="row" style={gridStyle}>
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
