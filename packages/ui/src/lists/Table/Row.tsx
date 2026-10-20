import useMergedRef from '@react-hook/merged-ref';
import classNames from 'classnames';
import React, {
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  DisabledReasonTooltip,
  type DisabledWithReason,
} from '../../actions/disabledReason';
import ProgressBar from '../../feedback/ProgressBar';
import { useAutoincrementIntegerId } from '../../hooks/useAutoincrementIntegerId';
import Link from '../../navigation/Link';
import { useNavigation } from '../../navigation/NavigationProvider';
import { DragHandle, SortableItem } from '../dnd';
import type { RefCallback } from '../dnd/types';
import Cell, { type TableFirstCell } from './Cell';
import { TableRowNameIdContext, useTableRowsContext } from './TableContext';

export type RowSelection = {
  selected: boolean;
  onSelect: (event: React.MouseEvent<HTMLElement>) => void;
  /** The checkbox shows its state, but the user cannot change it */
  disabled?: boolean;
};

/**
 * What a click on the row does. With `to`, the cells are a link, and only the
 * checkbox selects the row. With `onOpen`, the row opens. With neither, a click
 * on the row calls `selection.onSelect`.
 */
export type RowAction =
  // The cells are a link to a route of the app
  | {
      to: string;
      /**
       * The link keeps the query string of the current page (for example,
       * the filters of the list)
       */
      keepSearch?: boolean;
      onOpen?: never;
      active?: never;
      openWithArrows?: never;
    }
  // A click on the row opens it
  | {
      /**
       * A click on the row opens it (for example, an event in a side panel).
       * Links and buttons in the row keep their own action. The row takes the
       * focus, and Enter or Space opens it.
       */
      onOpen: () => void;
      /** The row is open: it shows the selected color, and it scrolls into view */
      active?: boolean;
      /** The Up and Down arrows open the previous or the next row */
      openWithArrows?: boolean;
      to?: never;
      keepSearch?: never;
    }
  // A click on the row selects it
  | {
      to?: never;
      keepSearch?: never;
      onOpen?: never;
      active?: never;
      openWithArrows?: never;
    };

/**
 * The drag handle at the left of the row: the handle that the library listens
 * to, or a disabled handle with the reason in a tooltip
 */
export type RowDragHandle =
  /** The user drags the row */
  | { ref: RefCallback; disabled?: never }
  /** The user cannot drag the row now */
  | { disabled: DisabledWithReason; ref?: never };

export type RowDrag = {
  /**
   * The element that the library moves. It has a position, thus the drop
   * indicator can be in it.
   */
  wrapperRef?: Ref<HTMLDivElement>;
  /** The line that shows where the row goes */
  dropIndicator?: ReactNode;
  /** Without it, the row has no handle */
  handle?: RowDragHandle;
};

type RowBaseProps<R> = {
  /** The value that the `renderCell` of the columns get */
  row?: R;
  /**
   * The state of the checkbox of the row, in a table with `checkboxes`.
   * Without `to` and `onOpen`, a click on the row also calls `onSelect`.
   */
  selection?: RowSelection;
  /**
   * The parts that a drag and drop library gives to the row. Table.SortableRow
   * sets them. A tree (the records of a tree model) gives them from its own
   * library.
   */
  drag?: RowDrag;
  /** The row shows the look of a row that the user drags */
  dragging?: boolean;
  /** The row shows a loading line at its bottom */
  fetching?: boolean;
  /**
   * The text of the row is subtle and its images fade, but the user can
   * still open it. Use it for an element that is off (for example a
   * deactivated user), with a Pill that tells it.
   * @default false
   */
  muted?: boolean;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement> &
    Record<`data-${string}`, string>;
  /** The element of the row, without the handle */
  rowRef?: Ref<HTMLDivElement>;
  rowClassName?: string;
  /**
   * In a tree: the indentation of the row and the toggle of its child rows.
   * In a `tree` table, the first cell keeps the space of the toggle also
   * without it.
   */
  firstCell?: TableFirstCell;
  /**
   * The controls of the row (for example an `Open` button and a menu), in the
   * column at the end of the row (see `trailingWidth` of <Table>). They show
   * when the pointer is over the row or the focus is in it, and always on a
   * device with no hover. A click in them never opens the row.
   */
  trailing?: ReactNode;
  /** Cells in place of the cells of the columns. Use <Table.Cell>. */
  children?: ReactNode;
};

export type RowProps<R = any> = RowBaseProps<R> & RowAction;

function Handle({ handle }: { handle?: RowDragHandle }) {
  if (!handle) {
    return null;
  }

  if ('ref' in handle) {
    return (
      <DragHandle
        ref={handle.ref}
        gutter="wide"
        className="Table__row-handle"
      />
    );
  }

  // The tooltip is on the handle, not on the icon: the icon component does
  // not pass the ref that the tooltip needs, and the handle is a larger
  // target for the pointer
  return (
    <DisabledReasonTooltip disabled={handle.disabled}>
      <DragHandle
        gutter="wide"
        className="Table__row-handle Table__row-handle--disabled"
      />
    </DisabledReasonTooltip>
  );
}

// A row with no data (for example, an upload in progress) gets an invisible
// checkbox: it keeps the cells aligned with the other rows.
function SelectionCell({
  placeholder,
  onSelect,
  selected,
  disabled,
  insideRowClick,
  labelledBy,
}: {
  placeholder: boolean;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  selected?: boolean;
  disabled?: boolean;
  // The click on the row selects it, thus the cell has no click handler
  insideRowClick: boolean;
  // The ID of the first cell: the name of the row is the name of the checkbox
  labelledBy: string;
}) {
  if (placeholder) {
    return (
      <div className="Table__cell Table__cell--row-selection">
        <div className="Table__cell--checkbox Table__cell--color-transparent">
          <input
            type="checkbox"
            readOnly={true}
            disabled={true}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="Table__cell Table__cell--row-selection"
      onClick={insideRowClick ? undefined : onSelect}
    >
      <div className="Table__cell--checkbox">
        <input
          type="checkbox"
          readOnly={true}
          checked={Boolean(selected)}
          disabled={disabled}
          aria-labelledby={labelledBy}
        />
      </div>
    </div>
  );
}

const NO_FIRST_CELL: TableFirstCell = {};

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation();
}

/**
 * A row of the table. The cells come from the `renderCell` of the visible
 * columns, or from the children (Table.Cell).
 */
function Row<R>({
  row,
  to: path,
  keepSearch = false,
  selection,
  onOpen,
  active = false,
  openWithArrows = false,
  drag,
  dragging,
  fetching,
  wrapperProps,
  rowRef,
  rowClassName,
  firstCell,
  muted = false,
  trailing,
  children,
}: RowProps<R>) {
  const {
    columnsByName,
    columnNames,
    selectable,
    trailingWidth,
    tree,
    truncate,
  } = useTableRowsContext('Table.Row');
  const nameId = `table-row-name-${useAutoincrementIntegerId()}`;
  const { location } = useNavigation();
  const search = keepSearch ? (location?.search ?? '') : '';
  const to = path ? `${path}${search}` : undefined;

  const onSelect = selection?.disabled ? undefined : selection?.onSelect;
  const selected = selection?.selected ?? false;

  const ownRowRef = useRef<HTMLDivElement>(null);
  const mergedRowRef = useMergedRef(ownRowRef, rowRef ?? null);

  // A link can open a row that is out of view, thus the open row scrolls into
  // view. Only the list scrolls: the areas around it (for example a docs page
  // around an example) stay where they are. The TypeScript DOM types do not
  // have "container" yet.
  useEffect(() => {
    if (active) {
      ownRowRef.current?.scrollIntoView({
        block: 'nearest',
        container: 'nearest',
      } as ScrollIntoViewOptions);
    }
  }, [active]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!onOpen) {
        onSelect?.(event);
        return;
      }

      const interactive = (event.target as HTMLElement).closest(
        'a, button, input',
      );

      if (interactive && event.currentTarget.contains(interactive)) {
        return;
      }

      onOpen();
    },
    [onOpen, onSelect],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onOpen || event.target !== event.currentTarget) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen();
        return;
      }

      if (
        openWithArrows &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      ) {
        const wrapper = event.currentTarget.closest('.Table__row-wrapper');
        const siblingWrapper =
          event.key === 'ArrowDown'
            ? wrapper?.nextElementSibling
            : wrapper?.previousElementSibling;
        const sibling =
          siblingWrapper?.querySelector<HTMLElement>('.Table__row');

        if (sibling) {
          event.preventDefault();
          sibling.focus();
          sibling.click();
        }
      }
    },
    [onOpen, openWithArrows],
  );

  const cells =
    children ??
    columnNames.map((name, index) => (
      <Cell
        key={name}
        index={index}
        firstCell={
          index === 0 && (tree || firstCell)
            ? (firstCell ?? NO_FIRST_CELL)
            : undefined
        }
        truncate={columnsByName.get(name)?.truncate ?? truncate}
      >
        {row !== undefined ? columnsByName.get(name)?.renderCell?.(row) : null}
      </Cell>
    ));

  // The events of the controls (also the ones that come through a portal,
  // for example from a menu) stop here, thus they do not open the row
  const trailingCell = trailingWidth !== undefined && (
    <div
      className="Table__row__trailing"
      style={{ width: trailingWidth }}
      onClick={stopPropagation}
    >
      {trailing}
    </div>
  );

  const className = classNames('Table__row', rowClassName, {
    'Table__row--selected': selected,
    'Table__row--openable': onOpen,
    'Table__row--active': active,
    'Table__row--muted': muted,
    'is-dragging': dragging,
  });

  return (
    <TableRowNameIdContext.Provider value={nameId}>
      <div
        {...wrapperProps}
        className="Table__row-wrapper"
        ref={drag?.wrapperRef}
      >
        <Handle handle={drag?.handle} />
        {to ? (
          <div className={className} ref={mergedRowRef}>
            {selectable && (
              <SelectionCell
                placeholder={row === undefined}
                onSelect={onSelect}
                selected={selected}
                disabled={selection?.disabled}
                insideRowClick={false}
                labelledBy={nameId}
              />
            )}
            <Link to={to} className="Table__row__inner">
              {cells}
            </Link>
            {trailingCell}
          </div>
        ) : (
          <div
            className={className}
            ref={mergedRowRef}
            onClick={handleClick}
            onKeyDown={onOpen ? handleKeyDown : undefined}
            tabIndex={onOpen ? 0 : undefined}
            aria-current={onOpen && active ? 'true' : undefined}
          >
            {selectable && (
              <SelectionCell
                placeholder={row === undefined}
                onSelect={onSelect}
                selected={selected}
                disabled={selection?.disabled}
                insideRowClick={true}
                labelledBy={nameId}
              />
            )}
            <div className="Table__row__inner">{cells}</div>
            {trailingCell}
          </div>
        )}
        {fetching && (
          <ProgressBar
            placement="edge"
            ariaLabel={{ id: 'table.row.loading' }}
          />
        )}
        {drag?.dropIndicator}
      </div>
    </TableRowNameIdContext.Provider>
  );
}

export const MemoRow = React.memo(Row) as typeof Row;

export type SortableRowProps<R = any> = Omit<RowBaseProps<R>, 'drag'> &
  RowAction & {
    /** The identifier of the row in the Table.Body with `reorder` */
    id: string;
    /** The position of the row in the Table.Body with `reorder` */
    index: number;
  };

/** A row that the user drags to a new position. Use it in a Table.Body with `reorder`. */
function SortableRow<R>({ id, index, dragging, ...rest }: SortableRowProps<R>) {
  return (
    <SortableItem id={id} index={index} handle={true}>
      {({ ref, handleRef, isDragging, dropIndicator }) => (
        <MemoRow
          {...rest}
          drag={{ wrapperRef: ref, handle: { ref: handleRef }, dropIndicator }}
          dragging={isDragging || dragging}
        />
      )}
    </SortableItem>
  );
}

export const MemoSortableRow = React.memo(SortableRow) as typeof SortableRow;
