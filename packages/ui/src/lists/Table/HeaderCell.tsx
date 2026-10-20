import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import { Generic, Navigation } from '../../../icons/index';
import { useTranslation } from '../../i18n';
import { DragHandle, SortableItem } from '../dnd';
import { columnCellStyle } from './layout';
import type { SortDirection, TableColumn } from './types';

type Props = {
  column: TableColumn;
  index: number;
  resizable: boolean;
  direction: SortDirection | null;
  // Without it, the user cannot sort on this column
  onDirectionChange?: (
    columnName: string,
    direction: SortDirection | null,
  ) => void;
  onResizeStart: (index: number, event: React.PointerEvent) => void;
  // The content before the label, in the first cell only
  prefix?: ReactNode;
};

function nextDirection(direction: SortDirection | null): SortDirection | null {
  if (direction === null) {
    return 'asc';
  }

  return direction === 'asc' ? 'desc' : null;
}

function HeaderCell({
  column,
  index,
  resizable,
  direction,
  onDirectionChange,
  onResizeStart,
  prefix,
}: Props) {
  const { tc } = useTranslation();
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onDirectionChange?.(column.name, nextDirection(direction));
  };

  const label = onDirectionChange ? (
    <a href="#" onClick={handleClick}>
      {tc(column.label)}{' '}
      {direction !== null && (
        <span className="Table__header-cell__cell__direction">
          {direction === 'asc' ? (
            <Navigation.ArrowUpIcon />
          ) : (
            <Navigation.ArrowDownIcon />
          )}
        </span>
      )}
    </a>
  ) : (
    tc(column.label)
  );

  return (
    <SortableItem id={column.name} index={index} handle={true}>
      {({ ref, handleRef, isDragging, dropIndicator }) => (
        <div
          className={classNames('Table__header-cell', {
            'Table__header-cell--first-real-cell': index === 0,
            'is-dragging': isDragging,
          })}
          ref={ref}
          style={columnCellStyle(index)}
        >
          <DragHandle ref={handleRef} className="Table__header-cell__reorder" />
          <div className="Table__header-cell__cell">
            {prefix ? (
              <span className="Table__first-cell-wrapper">
                {prefix}
                <div>{label}</div>
              </span>
            ) : (
              label
            )}
          </div>
          {resizable && (
            <span
              className="Table__header-cell__resize"
              onPointerDown={(event) => onResizeStart(index, event)}
            />
          )}
          {dropIndicator}
        </div>
      )}
    </SortableItem>
  );
}

export default React.memo(HeaderCell);
