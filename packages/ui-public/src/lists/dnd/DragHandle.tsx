import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { Generic } from '../../../icons';

export type DragHandleProps = {
  /**
   * Puts the handle in the gutter at the left of the item, out of its
   * content. "wide" is a wider gutter, for a table row. The item must have a
   * CSS `position`. Without it, the handle stays in the flow, and its place
   * comes from `className`.
   */
  gutter?: 'normal' | 'wide';
  /** A class for the place of the handle in its block */
  className?: string;
};

/**
 * The grip that the user drags to move an item. Give it the `handleRef` of
 * SortableItem (or of useDraggable) as `ref`. It shows when the pointer is
 * on the item.
 */
const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
  function DragHandle({ gutter, className }, ref) {
    return (
      <span
        ref={ref}
        className={classNames(
          'DragHandle',
          gutter && 'DragHandle--gutter',
          gutter === 'wide' && 'DragHandle--gutter-wide',
          className,
        )}
      >
        <Generic.DragGripIcon />
      </span>
    );
  },
);

export default DragHandle;
