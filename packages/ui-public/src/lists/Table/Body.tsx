import classNames from 'classnames';
import React, { forwardRef, type ReactNode } from 'react';
import {
  type SortableDropResult,
  SortableList,
  useSortableListState,
} from '../dnd';
import { useTableRowsContext } from './TableContext';

export type TableReorder = {
  /** Runs when the user drops a row at a new position */
  onDrop: (result: SortableDropResult) => void;
  /** The handles show, but the rows stay in place */
  disabled?: boolean;
};

export type TableBodyProps = {
  /**
   * The user reorders the rows by their handle. Use Table.SortableRow for the
   * rows and `reorderable` on the table.
   */
  reorder?: TableReorder;
  className?: string;
  style?: React.CSSProperties;
  /** The rows */
  children: ReactNode;
};

type ContentProps = {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  { className, style, children },
  ref,
) {
  return (
    <div
      ref={ref}
      className={classNames('Table__content', className)}
      style={style}
    >
      {children}
    </div>
  );
});

// The card shows that a drag is in progress: the rows do not show the hover
// color while the user drags
const SortableContent = forwardRef<HTMLDivElement, ContentProps>(
  function SortableContent({ className, ...rest }, ref) {
    const { isDragging } = useSortableListState();

    return (
      <Content
        ref={ref}
        className={classNames(className, { 'is-dragging-over': isDragging })}
        {...rest}
      />
    );
  },
);

/** The rows of the table */
const Body = forwardRef<HTMLDivElement, TableBodyProps>(function Body(
  { reorder, className, style, children },
  ref,
) {
  const { reorderable } = useTableRowsContext('Table.Body');

  if (import.meta.env.DEV && reorder && !reorderable) {
    console.warn(
      'Table.Body: a body with `reorder` must be in a <Table reorderable>',
    );
  }

  if (!reorder) {
    return (
      <Content ref={ref} className={className} style={style}>
        {children}
      </Content>
    );
  }

  return (
    <SortableList onDrop={reorder.onDrop} disabled={reorder.disabled}>
      <SortableContent ref={ref} className={className} style={style}>
        {children}
      </SortableContent>
    </SortableList>
  );
});

export default React.memo(Body);
