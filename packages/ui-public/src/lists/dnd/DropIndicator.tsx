import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import classNames from 'classnames';
import React, { useMemo } from 'react';

export type DropIndicatorProps = {
  /** The edge of the element where the dragged item goes. */
  edge: Edge;
  /**
   * The space between the element and its sibling on the side of the edge,
   * as a CSS length. The line goes in the middle of the space.
   * @default '0px'
   */
  gap?: string;
  /**
   * Moves the start of the line to the right (or down), as a CSS length.
   * Use it to indent the line.
   * @default '0px'
   */
  inset?: string;
};

// Put the indicator in an element that has a CSS position, at the edge that
// is nearest to the pointer.
function DropIndicator({
  edge,
  gap = '0px',
  inset = '0px',
}: DropIndicatorProps) {
  const style = useMemo(
    () =>
      ({
        '--DropIndicator-gap': gap,
        '--DropIndicator-inset': inset,
      }) as React.CSSProperties,
    [gap, inset],
  );

  return (
    <div
      className={classNames('DropIndicator', `DropIndicator--${edge}`)}
      style={style}
      aria-hidden="true"
    />
  );
}

export default React.memo(DropIndicator);
