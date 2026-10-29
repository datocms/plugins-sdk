import type { ReactNode } from 'react';
import type { Message } from '../../Message';

export type TableColumn<R = any> = {
  /** The identifier of the column. The layout keeps it. */
  name: string;
  /** The label in the header and in the columns menu */
  label: Message;
  /** The user can sort the rows by this column (with `sort.onChange` on the table) */
  sortable?: boolean;
  /**
   * The cell shows its content on one line, and a long text stops at the width
   * of the column with an ellipsis. It overrides the `truncate` prop of the
   * table (true by default). Set it to false for a cell with a layout of its
   * own (images, lists, more lines).
   */
  truncate?: boolean;
  /**
   * The smallest width of the column in pixels, with the padding of the cell.
   * When the visible columns do not fit at their smallest width, the table
   * hides the columns with the lowest `priority` (see fitTableLayout).
   */
  minWidth?: number;
  /**
   * On a narrow table, the columns with a lower priority go first (the default
   * is 0). The first visible column always stays.
   */
  priority?: number;
  /**
   * The content of the cell of this column for a row. A row with its own
   * children does not use it.
   */
  renderCell?: (row: R) => ReactNode;
};

// `width` is relative to the widths of the other columns of the layout
export type TableLayoutColumn = { name: string; width: number };

// The visible columns, in their order. This is the value that a storage
// keeps (Redux, the browser storage or the memory).
export type TableLayout = {
  columns: TableLayoutColumn[];
};

export type SortDirection = 'asc' | 'desc';

export type TableSort = {
  columnName: string;
  direction: SortDirection;
};

/** The order of the rows of a table, and the function that changes it */
export type TableSortState = {
  /** The column and the direction of the order, or null for no order */
  value: TableSort | null;
  /**
   * Runs when the user clicks the header of a sortable column. Without it,
   * the header shows the order, but the user cannot change it.
   */
  onChange?: (sort: TableSort | null) => void;
};
