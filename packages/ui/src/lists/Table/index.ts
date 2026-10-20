import Body from './Body';
import Cell from './Cell';
import Header from './Header';
import { MemoRow, MemoSortableRow } from './Row';
import BaseTable from './Table';

// See AGENTS.md in this folder.
export const Table = Object.assign(BaseTable, {
  Header,
  Body,
  Row: MemoRow,
  SortableRow: MemoSortableRow,
  Cell,
});

export type { TableBodyProps, TableReorder } from './Body';
export type { TableCellProps, TableFirstCell } from './Cell';
export type { TableHeaderProps, TableSelectAll } from './Header';
export { resolveTableLayout } from './layout';
export type {
  RowAction,
  RowDrag,
  RowDragHandle,
  RowProps,
  RowSelection,
  SortableRowProps,
} from './Row';
export {
  type TableLayoutStorage,
  useInMemoryTableLayout,
  useLocalStorageTableLayout,
} from './storage';
export type { TableCheckboxes, TableProps } from './Table';
export type { TableRowExpandable } from './TreeToggle';
export type {
  SortDirection,
  TableColumn,
  TableLayout,
  TableLayoutColumn,
  TableSort,
  TableSortState,
} from './types';
export { type ClientSortColumn, useClientSort } from './useClientSort';
