import { useMemo, useState } from 'react';
import type { TableColumn, TableSort, TableSortState } from './types';

// A column of a list that has all its rows in memory. `compare` sorts the
// rows in the browser when the user clicks the header of the column.
export type ClientSortColumn<R> = TableColumn<R> & {
  compare?: (a: R, b: R) => number;
};

/**
 * Sorts the rows in the browser with the `compare` function of the sorted
 * column. Give `rows` to the table and `sort` to its `sort` prop. Without a
 * sort, the rows keep their order. `initialSort` is the sort
 * of the first render.
 */
export function useClientSort<R>(
  rows: R[],
  columns: ClientSortColumn<R>[],
  initialSort: TableSort | null = null,
) {
  const [value, onChange] = useState<TableSort | null>(initialSort);
  const sort = useMemo<TableSortState>(() => ({ value, onChange }), [value]);

  const sortedRows = useMemo(() => {
    if (!value) {
      return rows;
    }

    const compare = columns.find((c) => c.name === value.columnName)?.compare;

    if (!compare) {
      return rows;
    }

    const direction = value.direction === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => compare(a, b) * direction);
  }, [rows, value, columns]);

  return { rows: sortedRows, sort };
}
