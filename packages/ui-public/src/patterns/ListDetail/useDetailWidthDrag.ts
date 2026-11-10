import { useCallback, useRef, useState } from 'react';
import { useListDetailWidths } from './Widths';

// The width of the detail before the user resizes it
export const DEFAULT_DETAIL_WIDTH = 500;

// The detail keeps at least this width: in a smaller window, the list
// becomes narrower
export const MIN_DETAIL_WIDTH = 360;

type Options = {
  // The border of the detail with the sash. A drag away from the detail
  // makes the detail wider.
  sashSide: 'left' | 'right';
  // The largest width of the detail. Without it, the drag has no limit.
  maxWidth?: number;
};

/**
 * The width of the detail and the handlers of its sash. The detail beside
 * the list and the detail over the list share the stored width of
 * ListDetailWidthsProvider. The new width goes to the provider only at the
 * end of the drag.
 */
export function useDetailWidthDrag({ sashSide, maxWidth }: Options) {
  const { detailWidth: storedWidth, onDetailWidthChange } =
    useListDetailWidths();
  const [dragWidth, setDragWidth] = useState<number>();
  // The stored width can be larger than the limit of a smaller window
  const width = Math.max(
    MIN_DETAIL_WIDTH,
    Math.min(
      maxWidth ?? Number.POSITIVE_INFINITY,
      dragWidth ?? storedWidth ?? DEFAULT_DETAIL_WIDTH,
    ),
  );
  const drag = useRef<{ x: number; width: number; last?: number }>({
    x: 0,
    width: 0,
  });

  const onMouseDown = useCallback(
    (x: number) => {
      drag.current = { x, width, last: undefined };
    },
    [width],
  );

  const onMouseMove = useCallback(
    (x: number) => {
      const { x: startX, width: startWidth } = drag.current;
      const distance = sashSide === 'right' ? x - startX : startX - x;
      const newWidth = Math.max(
        MIN_DETAIL_WIDTH,
        Math.min(maxWidth ?? Number.POSITIVE_INFINITY, startWidth + distance),
      );
      drag.current.last = newWidth;
      setDragWidth(newWidth);
    },
    [sashSide, maxWidth],
  );

  const onMouseUp = useCallback(() => {
    const { last } = drag.current;
    if (last !== undefined) onDetailWidthChange(last);
    setDragWidth(undefined);
  }, [onDetailWidthChange]);

  return { width, sashHandlers: { onMouseDown, onMouseMove, onMouseUp } };
}
