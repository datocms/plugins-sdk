import type { CSSProperties } from 'react';
import type { SortableDropResult } from '../dnd';
import { reorder } from '../dnd/reorder';
import type { TableColumn, TableLayout, TableLayoutColumn } from './types';

// The smallest width of a column, as a fraction of the table width
export const MIN_COLUMN_WIDTH = 0.05;

// The width that a column gets when the user shows it, as a fraction of the
// table width
const NEW_COLUMN_WIDTH = 0.15;

// The layout that the table shows: only the columns that exist, with widths
// that are fractions of the table width. The sum of the widths is 1.
export type ResolvedTableLayout = {
  columnNames: string[];
  widths: number[];
};

export function resolveTableLayout(
  columns: TableColumn[],
  layout: TableLayout,
): ResolvedTableLayout {
  const existing = layout.columns.filter(({ name }) =>
    columns.some((column) => column.name === name),
  );

  const total = existing.reduce((sum, column) => sum + column.width, 0);
  const widths = existing.map((column) => column.width / total);

  // The last column gets the rest, thus the sum is exactly 1
  if (widths.length > 0) {
    widths[widths.length - 1] +=
      1 - widths.reduce((sum, width) => sum + width, 0);
  }

  return {
    columnNames: existing.map((column) => column.name),
    widths,
  };
}

function toLayoutColumns({
  columnNames,
  widths,
}: ResolvedTableLayout): TableLayoutColumn[] {
  return columnNames.map((name, index) => ({ name, width: widths[index] }));
}

// The smallest width in pixels of a column without its own `minWidth`
const DEFAULT_MIN_COLUMN_PIXELS = 120;

// The columns that fit in `availableWidth` (in pixels) at their smallest
// width. When they do not all fit, the columns with the lowest priority go
// away first (of two columns with the same priority, the last one). The
// first column always stays. The other columns share the width of the hidden
// columns. The stored layout does not change: on a wider table, the hidden
// columns come back.
export function fitTableLayout(
  resolved: ResolvedTableLayout,
  columnsByName: Map<string, TableColumn>,
  availableWidth: number | undefined,
): ResolvedTableLayout {
  if (availableWidth === undefined) {
    return resolved;
  }

  const minWidth = (name: string) =>
    columnsByName.get(name)?.minWidth ?? DEFAULT_MIN_COLUMN_PIXELS;
  const priority = (name: string) => columnsByName.get(name)?.priority ?? 0;

  const names = [...resolved.columnNames];
  let total = names.reduce((sum, name) => sum + minWidth(name), 0);

  while (names.length > 1 && total > availableWidth) {
    let dropIndex = names.length - 1;

    for (let index = names.length - 2; index >= 1; index -= 1) {
      if (priority(names[index]) < priority(names[dropIndex])) {
        dropIndex = index;
      }
    }

    total -= minWidth(names[dropIndex]);
    names.splice(dropIndex, 1);
  }

  if (names.length === resolved.columnNames.length) {
    return resolved;
  }

  const widths = names.map(
    (name) => resolved.widths[resolved.columnNames.indexOf(name)],
  );
  const sum = widths.reduce((acc, width) => acc + width, 0);

  return { columnNames: names, widths: widths.map((width) => width / sum) };
}

// A change that the header makes on the shown columns (see fitTableLayout),
// as a change of the full layout: the hidden columns keep their place and
// their width
export function withHiddenColumns(
  resolved: ResolvedTableLayout,
  shown: ResolvedTableLayout,
  layout: TableLayout,
): TableLayout {
  if (shown === resolved) {
    return layout;
  }

  const shownSum = shown.columnNames.reduce(
    (sum, name) => sum + resolved.widths[resolved.columnNames.indexOf(name)],
    0,
  );
  const changed = new Map(
    layout.columns.map((column) => [column.name, column.width * shownSum]),
  );
  const order = layout.columns.map((column) => column.name);
  // The shown columns take the new order, in the places of the shown columns
  let next = 0;
  const names = resolved.columnNames.map((name) =>
    changed.has(name) ? order[next++] : name,
  );

  return {
    columns: names.map((name) => ({
      name,
      width:
        changed.get(name) ??
        resolved.widths[resolved.columnNames.indexOf(name)],
    })),
  };
}

// A column that the user shows goes at the end. The other columns share the
// width of the column that the user hides.
export function toggleColumn(
  resolved: ResolvedTableLayout,
  columnName: string,
): TableLayout {
  const columns = toLayoutColumns(resolved);
  const existing = columns.find((column) => column.name === columnName);

  if (existing) {
    const rest = columns.filter((column) => column.name !== columnName);

    return {
      columns: rest.map((column) => ({
        ...column,
        width: column.width + existing.width / rest.length,
      })),
    };
  }

  return {
    columns: [
      ...columns.map((column) => ({
        ...column,
        width: column.width * (1 - NEW_COLUMN_WIDTH),
      })),
      { name: columnName, width: NEW_COLUMN_WIDTH },
    ],
  };
}

export function moveColumn(
  resolved: ResolvedTableLayout,
  dropResult: SortableDropResult,
): TableLayout {
  return { columns: reorder(toLayoutColumns(resolved), dropResult) };
}

// `amount` is the fraction of the table width that the column at `index`
// loses, and the column after it gets
export function resizeColumn(
  resolved: ResolvedTableLayout,
  index: number,
  amount: number,
): TableLayout {
  return {
    columns: toLayoutColumns(resolved).map((column, columnIndex) => {
      if (columnIndex === index) {
        return { ...column, width: column.width - amount };
      }

      if (columnIndex === index + 1) {
        return { ...column, width: column.width + amount };
      }

      return column;
    }),
  };
}

// The widths of the columns are CSS custom properties on the table element,
// one for each column. The cells read them, so a change of a property moves
// all the cells of the column. During a resize, the header writes the
// properties directly on the element: the table follows the pointer without a
// render of the rows.
export function columnWidthVariable(index: number) {
  return `--Table-col-${index}`;
}

export function toPercentage(width: number) {
  return `${width * 100}%`;
}

export function columnWidthsStyle(widths: number[]): CSSProperties {
  return Object.fromEntries(
    widths.map((width, index) => [
      columnWidthVariable(index),
      toPercentage(width),
    ]),
  );
}

const cellStyles: CSSProperties[] = [];

// The returned object is the same at each call, so memoized cells do not
// render again
export function columnCellStyle(index: number): CSSProperties {
  if (!cellStyles[index]) {
    cellStyles[index] = { width: `var(${columnWidthVariable(index)})` };
  }

  return cellStyles[index];
}
