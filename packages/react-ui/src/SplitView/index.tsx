import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SplitViewPane, type SplitViewPaneProps } from './SplitViewPane';
import { SashAction, SplitViewSash } from './SplitViewSash';
import s from './styles.module.css.json';
import { IAxis, ICacheSizes } from './types';

type SplitViewProps = {
  children: JSX.Element[];
  allowResize?: boolean;
  split?: 'vertical' | 'horizontal';
  sizes: (string | number)[];
  onChange: (sizes: number[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  performanceMode?: boolean;
  resizerSize?: number;
  sashAction?: SashAction;
};

export const SplitView = ({
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
}: SplitViewProps) => {
  const axis = useRef<IAxis>({ x: 0, y: 0 });
  const wrapper = useRef<HTMLDivElement>(null);
  const cacheSizes = useRef<ICacheSizes>({ sizes: [], sashPosSizes: [] });
  const [wrapperRect, setWrapperRect] = useState<DOMRect | undefined>(
    undefined,
  );
  const [isDragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (wrapper?.current) {
        setWrapperRect(wrapper.current.getBoundingClientRect());
      }
    });
    resizeObserver.observe(wrapper.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const { sizeName, splitPos, splitAxis } = useMemo<{
    sizeName: 'width' | 'height';
    splitPos: 'left' | 'top';
    splitAxis: 'x' | 'y';
  }>(
    () => ({
      sizeName: split === 'vertical' ? 'width' : 'height',
      splitPos: split === 'vertical' ? 'left' : 'top',
      splitAxis: split === 'vertical' ? 'x' : 'y',
    }),
    [split],
  );

  const wrapSize: number = wrapperRect ? wrapperRect[sizeName] : 0;

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
      document?.body?.classList?.add(s['SplitView--disable-select']);
      axis.current = { x, y };
      cacheSizes.current = { sizes, sashPosSizes };
      setDragging(true);
      onDragStart();
    },
    [onDragStart, sizes, sashPosSizes],
  );

  const handleMouseUp = useCallback(() => {
    document?.body?.classList?.remove(s['SplitView--disable-select']);
    setDragging(false);
    onDragEnd();
  }, [onDragEnd]);

  const handleMouseMove = useCallback(
    (x: number, y: number, i: number) => {
      const curAxis = { x, y };
      let distanceX = curAxis[splitAxis] - axis.current[splitAxis];

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
    [paneLimitSizes, onChange],
  );

  const paneFollow = !(performanceMode && isDragging);
  const paneSizes = paneFollow ? sizes : cacheSizes.current.sizes;
  const panePoses = paneFollow ? sashPosSizes : cacheSizes.current.sashPosSizes;

  return (
    <div
      className={classNames(
        s.SplitView,
        split === 'vertical' && s['SplitView--vertical'],
        split === 'horizontal' && s['SplitView--horizontal'],
        isDragging && s['SplitView--dragging'],
      )}
      ref={wrapper}
    >
      {children.map((childNode, childIndex) => {
        const isPane = childNode.type === SplitViewPane;
        const paneProps = isPane ? childNode.props : {};

        return (
          <SplitViewPane
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
      {sashPosSizes.slice(1, -1).map((posSize, index) => (
        <SplitViewSash
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          allowResize={allowResize}
          split={split}
          style={{
            [sizeName]: resizerSize,
            [splitPos]: posSize - resizerSize / 2,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={(x, y) => handleMouseMove(x, y, index)}
          onMouseUp={handleMouseUp}
          action={sashAction}
        />
      ))}
    </div>
  );
};

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
