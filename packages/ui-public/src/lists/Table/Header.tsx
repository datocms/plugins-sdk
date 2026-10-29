import React, { type ReactNode, useCallback, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { DisclosureChevronPlaceholder } from '../../navigation/Chevron';
import { type SortableDropResult, SortableList } from '../dnd';
import ColumnsMenu from './ColumnsMenu';
import HeaderCell from './HeaderCell';
import {
  columnWidthVariable,
  MIN_RESIZE_COLUMN_PIXELS,
  moveColumn,
  pushColumnWidths,
  resizeColumns,
  toggleColumn,
  toPercentage,
  withHiddenColumns,
} from './layout';
import { useTableHeaderContext } from './TableContext';
import { TreeToggleSlot } from './TreeToggle';
import type { SortDirection } from './types';

// In a tree, the label of the first column starts after the space of the
// toggle of the rows
const TREE_TOGGLE_SPACE = (
  <TreeToggleSlot>
    <DisclosureChevronPlaceholder />
  </TreeToggleSlot>
);

export type TableSelectAll = {
  /** All the rows are selected */
  selected: boolean;
  /** Runs when the user clicks the checkbox */
  onChange: (selected: boolean) => void;
};

export type TableHeaderProps = {
  /**
   * The checkbox that selects all the rows. It shows only in a table with
   * `checkboxes`. Without it, the checkbox column of the header is empty.
   */
  selectAll?: TableSelectAll;
};

/**
 * The labels of the visible columns. The user sorts, moves and resizes the
 * columns here, and the button at the end opens the menu that shows and
 * hides the columns.
 */
function Header({ selectAll }: TableHeaderProps) {
  const { tm } = useTranslation();
  const {
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
  } = useTableHeaderContext('Table.Header');

  // The widths of the columns are percentages of the width of this element,
  // not of the full row (the full row also holds the checkbox)
  const columnsRef = useRef<HTMLDivElement>(null);

  // The listeners of a resize live for the full gesture, thus they read the
  // current values through a ref
  const latest = useRef({ resolved, shown, onLayoutChange });
  latest.current = { resolved, shown, onLayoutChange };

  // During the drag, the widths of the column and of the columns after it go
  // directly on the table element as CSS custom properties, so the rows
  // follow the pointer with no render. The new layout goes to the storage at
  // the end.
  const handleResizeStart = useCallback(
    (index: number, startEvent: React.PointerEvent) => {
      const columnsElement = columnsRef.current;
      const table = rootRef.current;

      if (!columnsElement || !table) {
        return;
      }

      const target = startEvent.currentTarget as HTMLElement;
      const startX = startEvent.clientX;
      const columnsWidth = columnsElement.getBoundingClientRect().width;
      const startWidths = latest.current.shown.widths;
      const minWidth = MIN_RESIZE_COLUMN_PIXELS / columnsWidth;
      let widths = startWidths;

      startEvent.preventDefault();
      target.setPointerCapture(startEvent.pointerId);

      // Each move starts again from the widths at the start of the drag, thus
      // a drag back to the start gives the same widths again
      const handleMove = (event: PointerEvent) => {
        widths = pushColumnWidths(
          startWidths,
          index,
          (event.clientX - startX) / columnsWidth,
          minWidth,
        );

        for (let i = index; i < widths.length; i += 1) {
          table.style.setProperty(
            columnWidthVariable(i),
            toPercentage(widths[i]),
          );
        }
      };

      const handleEnd = () => {
        target.removeEventListener('pointermove', handleMove);
        target.removeEventListener('pointerup', handleEnd);
        target.removeEventListener('pointercancel', handleEnd);

        if (widths !== startWidths) {
          const current = latest.current;
          current.onLayoutChange(
            withHiddenColumns(
              current.resolved,
              current.shown,
              resizeColumns(current.shown, widths),
            ),
          );
        }
      };

      target.addEventListener('pointermove', handleMove);
      target.addEventListener('pointerup', handleEnd);
      target.addEventListener('pointercancel', handleEnd);
    },
    [rootRef],
  );

  // The columns menu lists all the visible columns of the layout
  const handleMove = useCallback(
    (result: SortableDropResult) => {
      onLayoutChange(moveColumn(resolved, result));
    },
    [resolved, onLayoutChange],
  );

  // The header lists only the shown columns
  const handleHeaderMove = useCallback(
    (result: SortableDropResult) => {
      onLayoutChange(
        withHiddenColumns(resolved, shown, moveColumn(shown, result)),
      );
    },
    [resolved, shown, onLayoutChange],
  );

  const handleToggle = useCallback(
    (columnName: string) => {
      onLayoutChange(toggleColumn(resolved, columnName));
    },
    [resolved, onLayoutChange],
  );

  const handleDirectionChange = useCallback(
    (columnName: string, direction: SortDirection | null) => {
      onSortChange?.(direction ? { columnName, direction } : null);
    },
    [onSortChange],
  );

  const { columnNames } = shown;

  return (
    <div className="Table__header">
      <div className="Table__row">
        {selectable && (
          <div className="Table__header-cell Table__header-cell--checkbox Table__cell--row-selection">
            {selectAll && (
              <input
                type="checkbox"
                aria-label={tm({ id: 'a11y.table.selectAll' })}
                onChange={(event) => selectAll.onChange(event.target.checked)}
                checked={selectAll.selected}
              />
            )}
          </div>
        )}
        <SortableList axis="horizontal" onDrop={handleHeaderMove}>
          <div className="Table__row__inner" ref={columnsRef}>
            {columnNames.map((name, index) => {
              const column = columns.find((c) => c.name === name)!;
              const sortable = Boolean(column.sortable && onSortChange);

              return (
                <HeaderCell
                  key={name}
                  column={column}
                  index={index}
                  resizable={index !== columnNames.length - 1}
                  direction={
                    sortable && sort?.columnName === name
                      ? sort.direction
                      : null
                  }
                  onDirectionChange={
                    sortable ? handleDirectionChange : undefined
                  }
                  onResizeStart={handleResizeStart}
                  prefix={index === 0 && tree ? TREE_TOGGLE_SPACE : undefined}
                />
              );
            })}
          </div>
        </SortableList>
        {trailingWidth !== undefined && (
          <div
            className="Table__row__trailing"
            style={{ width: trailingWidth }}
          />
        )}
      </div>
      <ColumnsMenu
        columns={columns}
        columnNames={resolved.columnNames}
        onMove={handleMove}
        onToggle={handleToggle}
      />
    </div>
  );
}

export default React.memo(Header);
