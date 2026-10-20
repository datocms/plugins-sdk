import classNames from 'classnames';
import React, {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIsSmallViewport } from '../../hooks/useMediaQuery';
import {
  columnWidthsStyle,
  fitTableLayout,
  resolveTableLayout,
} from './layout';
import {
  TableHeaderContext,
  type TableHeaderContextValue,
  TableRowsContext,
  type TableRowsContextValue,
} from './TableContext';
import type { TableColumn, TableLayout, TableSortState } from './types';

export type TableCheckboxes = {
  /**
   * All the checkboxes show. Without it, a row checkbox shows only on hover,
   * on focus or when the row is selected. Set it while a selection is in
   * progress, and in pickers.
   */
  alwaysVisible?: boolean;
};

export type TableProps<R = any> = {
  /** All the columns that the user can show */
  columns: TableColumn<R>[];
  /**
   * The visible columns and their widths. Get it from a storage adapter (see
   * storage.ts) or from Redux.
   */
  layout: TableLayout;
  onLayoutChange: (layout: TableLayout) => void;
  /**
   * The order of the rows: `useClientSort` or a hook of the app gives it.
   * Without it, the user cannot sort from the header.
   */
  sort?: TableSortState;
  /**
   * The header and the rows have a checkbox at their start. The `selectAll`
   * of <Table.Header> and the `selection` of <Table.Row> control them.
   */
  checkboxes?: TableCheckboxes;
  /**
   * The width in pixels of a column at the end of each row, outside the columns
   * of the layout and with no label: the controls of the row (see `trailing` of
   * <Table.Row>). The header keeps the same space empty, thus the button of the
   * columns menu sits over it.
   */
  trailingWidth?: number;
  /**
   * The rows have a drag handle at their left. Set it with the `reorder` of
   * <Table.Body>, or for rows that a library of the caller moves (a tree).
   */
  reorderable?: boolean;
  /**
   * The rows are a tree: the first cell holds the indentation and the toggle
   */
  tree?: boolean;
  /**
   * The cells show their content on one line, with an ellipsis. A column can
   * change it with its own `truncate`.
   */
  truncate?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * A table with columns that the user shows, hides, moves, resizes and
 * sorts. The parts are Table.Header, Table.Body, Table.Row,
 * Table.SortableRow and Table.Cell. See AGENTS.md in this folder.
 */
function Table<R>({
  columns,
  layout,
  onLayoutChange,
  sort: sortState,
  checkboxes,
  reorderable = false,
  trailingWidth,
  tree = false,
  truncate = true,
  className,
  children,
}: TableProps<R>) {
  const sort = sortState?.value ?? null;
  const selectable = Boolean(checkboxes);
  const onSortChange = sortState?.onChange;
  const rootRef = useRef<HTMLDivElement>(null);

  const resolved = useMemo(
    () => resolveTableLayout(columns, layout),
    [columns, layout],
  );

  const columnsByName = useMemo(
    () => new Map(columns.map((column) => [column.name, column])),
    [columns],
  );

  // The width of the columns of a row, without the checkbox and the
  // controls. The number of the columns does not change it: their widths are
  // percentages of it.
  const [availableWidth, setAvailableWidth] = useState<number>();

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      const inner = root.querySelector<HTMLElement>('.Table__row__inner');
      setAvailableWidth((inner ?? root).clientWidth);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // On a small viewport (a phone, a tablet), only the columns that fit. On a
  // wider viewport, the user resizes the columns and the panes.
  const isSmallViewport = useIsSmallViewport();
  const shown = useMemo(
    () =>
      fitTableLayout(
        resolved,
        columnsByName,
        isSmallViewport ? availableWidth : undefined,
      ),
    [resolved, columnsByName, isSmallViewport, availableWidth],
  );

  // The arrays are new when the layout changes, thus the keys are their
  // content. A resize changes only the widths, and the rows do not render
  // again.
  const columnNamesKey = shown.columnNames.join('\n');
  const widthsKey = shown.widths.join(',');

  const style = useMemo(() => columnWidthsStyle(shown.widths), [widthsKey]);

  const columnNames = useMemo(() => shown.columnNames, [columnNamesKey]);

  const rowsContext = useMemo<TableRowsContextValue>(
    () => ({
      columnsByName,
      columnNames,
      selectable,
      reorderable,
      trailingWidth,
      tree,
      truncate,
    }),
    [
      columnsByName,
      columnNames,
      selectable,
      reorderable,
      trailingWidth,
      tree,
      truncate,
    ],
  );

  const headerContext = useMemo<TableHeaderContextValue>(
    () => ({
      columns,
      resolved,
      shown,
      onLayoutChange,
      sort,
      onSortChange,
      rootRef,
      selectable,
      trailingWidth,
      tree,
    }),
    [
      columns,
      resolved,
      shown,
      onLayoutChange,
      sort,
      onSortChange,
      selectable,
      trailingWidth,
      tree,
    ],
  );

  return (
    <TableHeaderContext.Provider value={headerContext}>
      <TableRowsContext.Provider value={rowsContext}>
        <div
          ref={rootRef}
          className={classNames(
            'Table',
            {
              'Table--sortable': reorderable,
              'Table--tree': tree,
              'Table--checkboxes-visible': checkboxes?.alwaysVisible,
            },
            className,
          )}
          style={style}
        >
          {children}
        </div>
      </TableRowsContext.Provider>
    </TableHeaderContext.Provider>
  );
}

export default React.memo(Table) as typeof Table;
