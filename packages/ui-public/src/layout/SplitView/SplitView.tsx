import classNames from 'classnames';
import React, {
  type PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SplitViewPane, {
  type Props as SplitViewPaneProps,
} from './SplitViewPane';
import Sash, { SashAction } from './SplitViewSash';
import { IAxis, ICacheSizes } from './types';

type Props = {
  children: ReactElement<PropsWithChildren<SplitViewPaneProps>>[];
  allowResize?: boolean;
  split?: 'vertical' | 'horizontal';
  sizes: (string | number)[];
  onChange: (sizes: number[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  performanceMode?: boolean;
  resizerSize?: number;
  sashAction?: SashAction;
  sashZIndex?: number;
  // The index of the pane that a drag can collapse. When the drag makes this
  // pane narrower than half of its minimum size, the view calls
  // `onCollapseByDrag` and ignores the remaining part of the drag.
  collapsiblePaneIndex?: number;
  onCollapseByDrag?: () => void;
  // Renders a layer in the view, after the panes and the sashes. It gets the
  // position and the size of each pane (in the split axis), in layout pixels.
  // These are the values that the view gives to the panes, thus the layer
  // can align with a pane without a measurement of the DOM.
  renderOverPanes?: (panes: PaneBox[]) => React.ReactNode;
};

export type PaneBox = { start: number; size: number };

const SplitView = ({
  children,
  sizes: propSizes,
  allowResize = true,
  split = 'vertical',
  resizerSize = 10,
  performanceMode = false,
  onChange = () => null,
  onDragStart = () => null,
  onDragEnd = () => null,
  sashAction,
  sashZIndex,
  collapsiblePaneIndex,
  onCollapseByDrag,
  renderOverPanes,
}: Props) => {
  const axis = useRef<IAxis>({ x: 0, y: 0 });
  const wrapper = useRef<HTMLDivElement>(null);
  const cacheSizes = useRef<ICacheSizes>({ sizes: [], sashPosSizes: [] });
  const [wrapperRect, setWrapperRect] = useState<{
    width?: number;
    height?: number;
  }>({});
  const [isDragging, setDragging] = useState<boolean>(false);
  const isCollapsedByDrag = useRef(false);

  useEffect(() => {
    // Use the layout size from the entry, not getBoundingClientRect(). The
    // bounding rect includes CSS transforms. If an ancestor is in a scale
    // animation (for example, a modal that appears), the rect is too small.
    // The end of a transform does not trigger the observer again, thus the
    // panes keep the incorrect size.
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setWrapperRect({ width, height });
    });
    resizeObserver.observe(wrapper.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const { sizeName, splitPos, splitAxis } = useMemo(
    () =>
      split === 'vertical'
        ? ({ sizeName: 'width', splitPos: 'left', splitAxis: 'x' } as const)
        : ({ sizeName: 'height', splitPos: 'top', splitAxis: 'y' } as const),
    [split],
  );

  const wrapSize: number = wrapperRect[sizeName] ?? 0;

  // Get limit sizes via children
  const paneLimitSizes = useMemo(
    () =>
      children.map((childNode) => {
        const limits = [0, Infinity];
        if (childNode.type === SplitViewPane) {
          const { minSize, maxSize } = childNode.props as SplitViewPaneProps;
          limits[0] = assertSize(minSize, wrapSize, 0);
          limits[1] = assertSize(maxSize, wrapSize);
        }
        return limits as [number, number];
      }),
    [children, wrapSize],
  );

  const sizes = useMemo(() => {
    let count = 0;
    let curSum = 0;

    const res = children.map((_child, index) => {
      const size = clampSize(
        assertSize(propSizes[index], wrapSize),
        paneLimitSizes[index],
      );
      if (size === Infinity) {
        count = count + 1;
      } else {
        curSum = curSum + size;
      }
      return size;
    });

    // resize or illegal size input,recalculate pane sizes
    if (curSum > wrapSize || (!count && curSum < wrapSize)) {
      const cacheNum = (curSum - wrapSize) / curSum;
      return res.map((size) => {
        return size === Infinity ? 0 : size - size * cacheNum;
      });
    }

    if (count > 0) {
      const average = (wrapSize - curSum) / count;
      return res.map((size) => {
        return size === Infinity ? average : size;
      });
    }

    return res;
  }, [
    JSON.stringify(propSizes),
    JSON.stringify(paneLimitSizes),
    children.length,
    wrapSize,
  ]);

  const sashPosSizes = useMemo(
    () => sizes.reduce((a, b) => [...a, a[a.length - 1] + b], [0]),
    [JSON.stringify(sizes)],
  );

  const handleMouseDown = useCallback(
    (x: number, y: number) => {
      document?.body?.classList?.add('SplitView--disable-select');
      axis.current = { x, y };
      cacheSizes.current = { sizes, sashPosSizes };
      isCollapsedByDrag.current = false;
      setDragging(true);
      onDragStart();
    },
    [onDragStart, sizes, sashPosSizes],
  );

  const handleMouseUp = useCallback(() => {
    document?.body?.classList?.remove('SplitView--disable-select');
    setDragging(false);
    onDragEnd();
  }, [onDragEnd]);

  const handleMouseMove = useCallback(
    (x: number, y: number, i: number) => {
      if (isCollapsedByDrag.current) return;

      const curAxis = { x, y };
      let distanceX = curAxis[splitAxis] - axis.current[splitAxis];

      if (onCollapseByDrag && collapsiblePaneIndex !== undefined) {
        const unclampedSize =
          collapsiblePaneIndex === i
            ? sizes[i] + distanceX
            : collapsiblePaneIndex === i + 1
              ? sizes[i + 1] - distanceX
              : undefined;

        if (
          unclampedSize !== undefined &&
          unclampedSize < paneLimitSizes[collapsiblePaneIndex][0] / 2
        ) {
          isCollapsedByDrag.current = true;
          onCollapseByDrag();
          return;
        }
      }

      const leftBorder = -Math.min(
        sizes[i] - paneLimitSizes[i][0],
        paneLimitSizes[i + 1][1] - sizes[i + 1],
      );
      const rightBorder = Math.min(
        sizes[i + 1] - paneLimitSizes[i + 1][0],
        paneLimitSizes[i][1] - sizes[i],
      );

      if (distanceX < leftBorder) {
        distanceX = leftBorder;
      }
      if (distanceX > rightBorder) {
        distanceX = rightBorder;
      }

      const nextSizes = [...sizes];
      nextSizes[i] += distanceX;
      nextSizes[i + 1] -= distanceX;

      onChange(nextSizes);
    },
    [paneLimitSizes, onChange, collapsiblePaneIndex, onCollapseByDrag],
  );

  const paneFollow = !(performanceMode && isDragging);
  const paneSizes = paneFollow ? sizes : cacheSizes.current.sizes;
  const panePoses = paneFollow ? sashPosSizes : cacheSizes.current.sashPosSizes;
  const paneBoxes = useMemo(
    () => paneSizes.map((size, index) => ({ start: panePoses[index], size })),
    [paneSizes, panePoses],
  );

  return (
    <div
      className={classNames(
        'SplitView',
        split === 'vertical' && 'SplitView--vertical',
        split === 'horizontal' && 'SplitView--horizontal',
        isDragging && 'SplitView--dragging',
      )}
      ref={wrapper}
    >
      {children.map((childNode, childIndex) => {
        const isPane = childNode.type === SplitViewPane;
        const paneProps = isPane ? childNode.props : {};

        return (
          <SplitViewPane
            // biome-ignore lint/suspicious/noArrayIndexKey: children don't change at runtime
            key={childIndex}
            style={{
              ...paneProps.style,
              [sizeName]: paneSizes[childIndex],
              [splitPos]: panePoses[childIndex],
            }}
          >
            {isPane ? paneProps.children : childNode}
          </SplitViewPane>
        );
      })}
      {/* A sash that does not resize and has no button does nothing. It
       * is not rendered: next to a pane of zero width at the edge, it goes
       * out of the view and adds a horizontal scroll bar. */}
      {(allowResize || sashAction) &&
        sashPosSizes.slice(1, -1).map((posSize, index) => (
          <Sash
            // biome-ignore lint/suspicious/noArrayIndexKey: fine in this case
            key={index}
            allowResize={allowResize}
            split={split}
            style={{
              [sizeName]: resizerSize,
              [splitPos]: posSize - resizerSize / 2,
              ...(sashZIndex && { zIndex: sashZIndex }),
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={(x, y) => handleMouseMove(x, y, index)}
            onMouseUp={handleMouseUp}
            action={sashAction}
          />
        ))}
      {renderOverPanes?.(paneBoxes)}
    </div>
  );
};

export default Object.assign(SplitView, { Pane: SplitViewPane, Sash });

/**
 * Convert size to absolute number or Infinity
 * SplitPane allows sizes in string and number, but the state sizes only support number,
 * so convert string and number to number in here
 * 'auto' -> divide the remaining space equally
 * 'xxxpx' -> xxx
 * 'xxx%' -> wrapper.size * xxx/100
 *  xxx -> xxx
 */
function assertSize(
  size: string | number | undefined,
  sum: number,
  defaultValue = Infinity,
) {
  if (typeof size === 'undefined') return defaultValue;
  if (typeof size === 'number') return size;
  if (size.endsWith('%')) return sum * (+size.replace('%', '') / 100);
  if (size.endsWith('px')) return +size.replace('px', '');
  return defaultValue;
}

function clampSize(size: number, minMax: [number, number]) {
  return Math.max(minMax[0], Math.min(minMax[1], size));
}
