'use client';

import { useMemo, useState, type ReactNode } from 'react';

export type TableColumn<T extends string> = {
  readonly key: T;
  readonly label: string;
  readonly numeric?: boolean;
  readonly sortable?: boolean;
};

type SortDirection = 'asc' | 'desc';

type SortState<T extends string> = {
  readonly key: T;
  readonly direction: SortDirection;
};

type TableRowEntry<T extends string> = {
  readonly row: Partial<Record<T, string | number>>;
  readonly rowKey: string;
};

function compareCellValues(
  left: string | number | undefined,
  right: string | number | undefined,
  numeric: boolean,
): number {
  if (left === undefined && right === undefined) {
    return 0;
  }

  if (left === undefined) {
    return 1;
  }

  if (right === undefined) {
    return -1;
  }

  if (numeric) {
    const leftNumber =
      typeof left === 'number' ? left : Number.parseFloat(String(left).replace(/[^\d.-]/g, ''));
    const rightNumber =
      typeof right === 'number' ? right : Number.parseFloat(String(right).replace(/[^\d.-]/g, ''));

    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
      return leftNumber - rightNumber;
    }
  }

  return String(left).localeCompare(String(right), 'de-DE', { numeric: true, sensitivity: 'base' });
}

function sortIndicator(direction: SortDirection | null): string {
  if (direction === 'asc') {
    return '▲';
  }

  if (direction === 'desc') {
    return '▼';
  }

  return '↕';
}

/** Sortable, searchable data table for dashboard panels. */
export function DataTable<T extends string>({
  columns,
  rows,
  rowKeys,
  selectedRowKey,
  onRowSelect,
  searchable = false,
  searchPlaceholder = 'Tabelle durchsuchen…',
  emptyText,
  emptyHint,
  filteredEmptyText = 'Keine Treffer für die Suche.',
  renderCell,
}: {
  readonly columns: readonly TableColumn<T>[];
  readonly rows: ReadonlyArray<Partial<Record<T, string | number>>>;
  readonly rowKeys?: readonly string[];
  readonly selectedRowKey?: string | null;
  readonly onRowSelect?: (rowKey: string) => void;
  readonly searchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly emptyText: string;
  readonly emptyHint?: string;
  readonly filteredEmptyText?: string;
  readonly renderCell?: (key: T, row: Partial<Record<T, string | number>>) => ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState<T> | null>(null);

  const isSelectable = rowKeys !== undefined && onRowSelect !== undefined;

  const entries = useMemo<readonly TableRowEntry<T>[]>(
    () =>
      rows.map((row, rowIndex) => ({
        row,
        rowKey: rowKeys?.[rowIndex] ?? String(rowIndex),
      })),
    [rowKeys, rows],
  );

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length === 0) {
      return entries;
    }

    return entries.filter(({ row }) =>
      columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(query)),
    );
  }, [columns, entries, searchQuery]);

  const visibleEntries = useMemo(() => {
    if (sortState === null) {
      return filteredEntries;
    }

    const sortColumn = columns.find((column) => column.key === sortState.key);

    if (sortColumn === undefined || sortColumn.sortable === false) {
      return filteredEntries;
    }

    return [...filteredEntries].sort((left, right) => {
      const comparison = compareCellValues(
        left.row[sortState.key],
        right.row[sortState.key],
        sortColumn.numeric ?? false,
      );

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [columns, filteredEntries, sortState]);

  const handleSort = (columnKey: T) => {
    const column = columns.find((entry) => entry.key === columnKey);

    if (column?.sortable === false) {
      return;
    }

    setSortState((current) => {
      if (current?.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }

      return {
        key: columnKey,
        direction: current.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  };

  if (rows.length === 0) {
    return (
      <p className="empty-state">
        <strong>{emptyText}</strong>
        {emptyHint ? emptyHint : null}
      </p>
    );
  }

  return (
    <div className="data-table">
      {searchable ? (
        <div className="table-toolbar">
          <label className="table-search">
            <span className="sr-only">{searchPlaceholder}</span>
            <input
              type="search"
              className="table-search-input"
              value={searchQuery}
              placeholder={searchPlaceholder}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          {searchQuery.trim().length > 0 ? (
            <span className="table-result-count">
              {visibleEntries.length} von {entries.length}
            </span>
          ) : null}
        </div>
      ) : null}

      {visibleEntries.length === 0 ? (
        <p className="empty-state">
          <strong>{filteredEmptyText}</strong>
          {searchQuery.trim().length > 0 ? ` „${searchQuery.trim()}“` : null}
        </p>
      ) : (
        <div className="table-scroll">
          <table className="table-sticky">
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sortState?.key === column.key;
                const direction = isSorted ? sortState.direction : null;
                const isSortable = column.sortable !== false;

                return (
                  <th
                    key={column.key}
                    className={column.numeric ? 'numeric' : undefined}
                    aria-sort={
                      isSortable
                        ? isSorted
                          ? direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        className={`table-sort-button${column.numeric ? ' numeric' : ''}`}
                        onClick={() => handleSort(column.key)}
                      >
                        <span>{column.label}</span>
                        <span className="table-sort-indicator" aria-hidden="true">
                          {sortIndicator(isSorted ? direction : null)}
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleEntries.map(({ row, rowKey }) => {
              const isSelected = selectedRowKey === rowKey;

              return (
                <tr
                  key={rowKey}
                  className={`${isSelectable ? 'table-row-selectable' : ''}${isSelected ? ' table-row-selected' : ''}`.trim()}
                  tabIndex={isSelectable ? 0 : undefined}
                  aria-selected={isSelectable ? isSelected : undefined}
                  onClick={
                    isSelectable
                      ? () => {
                          onRowSelect(rowKey);
                        }
                      : undefined
                  }
                  onKeyDown={
                    isSelectable
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowSelect(rowKey);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <td key={column.key} className={column.numeric ? 'numeric' : undefined}>
                      {renderCell?.(column.key, row) ?? row[column.key] ?? ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
