import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import { DisabledReasonTooltip } from '../../actions/disabledReason';
import { DisclosureChevron } from '../../navigation/Chevron';
import { DragHandle, dropTargetClassName } from '../dnd';
import type { RowDrag, RowDragHandle } from '../Table/Row';
import Action from './Action';
import Link from './Link';

export type TreeRowProps = {
  /**
   * The row has children: the column of the handle shows the chevron that
   * opens and closes them.
   */
  expandable?: {
    /** The children show under the row */
    open: boolean;
    /** Runs on a click on the chevron */
    onToggle: () => void;
  };
  /**
   * The parts that SortableTree gives to the row: `wrapperRef` is
   * `provided.innerRef`, `dropIndicator` is `provided.dropIndicator`, and
   * `handle` is `{ ref: provided.dragHandleRef }`. With `handle`, the column
   * of the handle shows the grip, or the chevron of an `expandable` row.
   * Without `handle` and `expandable`, the row has no column of the handle.
   * Give `handle` to the SortableTree too: then a row with a disabled handle
   * or with no handle does not move.
   */
  drag?: RowDrag;
  /**
   * The indent of the level in px (`provided.draggableProps.style.paddingLeft`)
   * @default 0
   */
  indentation?: number;
  /** The row is the current one, for example open in an editor */
  selected?: boolean;
  /** The row is the one that the user drags */
  dragging?: boolean;
  /** A drop puts the dragged row in this row, as a child */
  dropTarget?: boolean;
  /**
   * After the column of the handle: a `TreeRow.Link`. A row with no handle
   * and no chevron takes a `TreeRow.Action`, which starts in that column.
   */
  children: ReactNode;
};

// A link is draggable in the browser, thus a drag from the toggle moves the
// link and not the row. "draggable={false}" gives the drag to the row. A
// button is not good: Firefox starts no drag from a button. The keyboard
// opens a row with the arrow keys of the tree, thus the toggle is hidden from
// screen readers.
function ExpandToggle({
  open,
  onToggle,
}: NonNullable<TreeRowProps['expandable']>) {
  // biome-ignore-start lint/a11y: see the comment of the function
  return (
    <a
      href="#"
      className="TreeRow__drag-handle"
      draggable={false}
      aria-hidden="true"
      tabIndex={-1}
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
    >
      <DisclosureChevron open={open} />
    </a>
  );
  // biome-ignore-end lint/a11y: see the comment of the function
}

// The tooltip is on the handle, not on the icon: the icon component does not
// pass the ref that the tooltip needs
function Grip({ handle }: { handle: RowDragHandle }) {
  if (handle.disabled) {
    return (
      <DisabledReasonTooltip disabled={handle.disabled}>
        <DragHandle className="TreeRow__drag-handle TreeRow__drag-handle--disabled" />
      </DisabledReasonTooltip>
    );
  }

  return <DragHandle className="TreeRow__drag-handle" />;
}

/**
 * A row of a `SortableTree`: the column of the handle (the chevron of a row
 * with children, or the grip), then the content. The indent of the level is
 * the left padding of the row.
 */
function TreeRow({
  expandable,
  drag,
  indentation = 0,
  selected,
  dragging,
  dropTarget = false,
  children,
}: TreeRowProps) {
  const handle = drag?.handle;

  return (
    <div
      // The row draws its own markup, with the classes of a RowList row
      // (ui-public/RowList)
      className={classNames(
        'RowList__item',
        'TreeRow',
        dropTargetClassName({ isOver: dropTarget }),
        {
          'RowList__item--selected': selected,
          'RowList__item--dragging': dragging,
        },
      )}
      ref={drag?.wrapperRef}
      style={{ paddingLeft: indentation }}
    >
      {(expandable || handle) && (
        // The library listens to the full column, thus the user also drags
        // the row from the chevron
        <div className="TreeRow__handle" ref={handle?.ref}>
          {expandable ? (
            <ExpandToggle {...expandable} />
          ) : (
            handle && <Grip handle={handle} />
          )}
        </div>
      )}
      {children}
      {drag?.dropIndicator}
    </div>
  );
}

export default Object.assign(TreeRow, { Link, Action });
