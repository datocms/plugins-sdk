import classNames from 'classnames';
import React, { type ReactNode, useContext, useMemo } from 'react';
import { columnCellStyle } from './layout';
import { TableRowNameIdContext } from './TableContext';
import {
  type TableRowExpandable,
  TreeToggle,
  TreeToggleSlot,
} from './TreeToggle';

/** A node of the tree */
type TreeNodeFirstCell = {
  /**
   * Give it when the row has child rows: the first cell shows the toggle
   * that opens and closes them. Without it, the row keeps the space of the
   * toggle, with a dash when the row is nested.
   */
  expandable?: TableRowExpandable;
  prefix?: never;
};

/** A row that is not a node of the tree (for example a "Load more" row) */
type CustomFirstCell = {
  /** The content in the space of the toggle */
  prefix: ReactNode;
  expandable?: never;
};

/**
 * The first cell of a tree row: the indentation and the toggle of the child
 * rows
 */
export type TableFirstCell = {
  /** The indentation in pixels */
  indentation?: number;
} & (TreeNodeFirstCell | CustomFirstCell);

export type TableCellProps = {
  /** The position of the column. The cell gets the width of the column. */
  index: number;
  /** A cell that is not in a column fills the row */
  fill?: boolean;
  /**
   * The first cell of a tree row puts its content in a wrapper with the
   * indentation and the toggle
   */
  firstCell?: TableFirstCell;
  /** The content stays on one line and stops with an ellipsis */
  truncate?: boolean;
  children?: ReactNode;
};

const FILL_STYLE = { width: '100%' };

/**
 * A cell of a row with its own children (for example a "Load more" row).
 * It gets the width of the column at `index`, or all the row with `fill`.
 */
function Cell({
  index,
  fill = false,
  firstCell,
  truncate = false,
  children,
}: TableCellProps) {
  const indentation = firstCell?.indentation;
  const rowNameId = useContext(TableRowNameIdContext);
  const nameId = index === 0 ? rowNameId : undefined;

  const wrapperStyle = useMemo(
    () => ({
      paddingLeft: indentation,
      '--indentation-width': `${indentation}px`,
    }),
    [indentation],
  );

  // The cell is a flex container, and the ellipsis does not apply to the
  // text of its items. Thus a block holds the content.
  const content = truncate ? (
    <div className="Table__cell__truncate">{children}</div>
  ) : (
    children
  );

  return (
    <div
      id={nameId}
      style={fill ? FILL_STYLE : columnCellStyle(index)}
      className={classNames('Table__cell', {
        'Table__cell--first-real-cell': index === 0,
      })}
    >
      {firstCell ? (
        <div
          className={classNames('Table__first-cell-wrapper', {
            'Table__first-cell-wrapper--nested': Boolean(indentation),
          })}
          style={wrapperStyle}
        >
          {firstCell.prefix !== undefined ? (
            <TreeToggleSlot>{firstCell.prefix}</TreeToggleSlot>
          ) : (
            <TreeToggle
              expandable={firstCell.expandable}
              nested={Boolean(indentation)}
              labelledBy={nameId}
            />
          )}
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
}

export default React.memo(Cell);
