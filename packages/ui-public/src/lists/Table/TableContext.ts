import { createContext, type RefObject, useContext } from 'react';
import type { ResolvedTableLayout } from './layout';
import type { TableColumn, TableLayout, TableSort } from './types';

// The parts of the table that the header uses. It changes when the layout or
// the sort changes.
export type TableHeaderContextValue = {
  columns: TableColumn[];
  // All the visible columns of the layout. The columns menu shows them.
  resolved: ResolvedTableLayout;
  // The columns that fit in the width of the table (see fitTableLayout). The
  // header shows them.
  shown: ResolvedTableLayout;
  onLayoutChange: (layout: TableLayout) => void;
  sort: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  // The table element. It holds the widths of the columns.
  rootRef: RefObject<HTMLDivElement | null>;
  selectable: boolean;
  trailingWidth?: number;
  tree: boolean;
};

// The parts of the table that the rows use. It changes only when the visible
// columns change, not when their widths change.
export type TableRowsContextValue = {
  columnsByName: Map<string, TableColumn>;
  columnNames: string[];
  selectable: boolean;
  reorderable: boolean;
  trailingWidth?: number;
  tree: boolean;
  // The default of the columns without their own `truncate`
  truncate: boolean;
};

// The ID of the first cell of a row. The text of the first cell is the name of
// the row: the checkbox and the toggle of the row take it.
export const TableRowNameIdContext = createContext<string | undefined>(
  undefined,
);

export const TableHeaderContext = createContext<TableHeaderContextValue | null>(
  null,
);

export const TableRowsContext = createContext<TableRowsContextValue | null>(
  null,
);

export function useTableHeaderContext(componentName: string) {
  const context = useContext(TableHeaderContext);

  if (!context) {
    throw new Error(`<${componentName}> must be in a <Table>`);
  }

  return context;
}

export function useTableRowsContext(componentName: string) {
  const context = useContext(TableRowsContext);

  if (!context) {
    throw new Error(`<${componentName}> must be in a <Table>`);
  }

  return context;
}
