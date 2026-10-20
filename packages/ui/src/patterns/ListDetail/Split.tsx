import classNames from 'classnames';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Navigation } from '../../../icons';
import { HotKeyListener } from '../../actions/HotKey';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import SplitPane from '../../layout/SplitPane';
import { useSashActionReveal } from '../../layout/SplitView/SashActionButton';
import SplitView from '../../layout/SplitView/SplitView';
import { useListDetailWidths } from './Widths';

// The smallest width of the list
const MIN_LIST_WIDTH = 360;

// The width of the detail before the user resizes it. The space at the
// right of the detail stays empty.
const DEFAULT_DETAIL_WIDTH = 500;

// Before the user resizes the list, the list takes the width that leaves
// the detail its default width, but not more than this. A resize of the
// detail does not move the list.
const MAX_FIRST_LIST_WIDTH = 1100;

// The detail keeps at least this width: in a smaller window, the list
// becomes narrower
const MIN_DETAIL_WIDTH = 360;

// The sash of the detail is on its right border
const DETAIL_SASH_STYLE: React.CSSProperties = {
  left: 'auto',
  right: -5,
  width: 10,
  zIndex: 2,
};

// Below this viewport width, the detail goes over the list
const OVERLAY_MEDIA_QUERY = '(max-width: 1100px)';

// The sash is on the left border of the detail over the list, as wide as
// the sash of a SplitView, and over the content of the detail
const SASH_STYLE: React.CSSProperties = { left: -5, width: 10, zIndex: 2 };

// The detail over the list has a fixed width: its sash only has the button
// that hides the detail
const noop = () => {};

const DetailOpenContext = createContext(false);

// The close of the detail when the detail goes over the list. The panel then
// shows a back button: on a touch screen, the sash button does not show.
const OverlayCloseContext = createContext<(() => void) | undefined>(undefined);

// The largest width of the split: the list and the detail. The space at the
// right of the detail stays empty. In a smaller window, the split fills the
// window.
export function getListDetailMaxWidth(
  listWidth: number | undefined,
  detailWidth: number | undefined,
) {
  return (
    (listWidth ?? MAX_FIRST_LIST_WIDTH) + (detailWidth ?? DEFAULT_DETAIL_WIDTH)
  );
}

export function useIsListDetailOpen() {
  return useContext(DetailOpenContext);
}

export function useListDetailOverlayClose() {
  return useContext(OverlayCloseContext);
}

/** The detail of the open row */
export type ListDetailSplitDetail = {
  /** The panel of the open row (a ListDetail.Panel). Without it, no row is open. */
  panel?: React.ReactNode;
  /**
   * Closes the open row. Escape, the button on the sash and, when the panel
   * goes over the list, the back button of the panel run it.
   */
  onClose: () => void;
};

export type ListDetailSplitProps = {
  /** The rows open a detail at the right. Without it, the list is alone. */
  detail?: ListDetailSplitDetail;
  /** The list: a Pane */
  children: React.ReactNode;
};

/**
 * A list at the left and the detail of the open row at the right, as the
 * records of a model in the cms. The list keeps its place and its width when
 * a row opens or closes, thus the user does not lose the row. When no row is
 * open, there is no detail: the space at the right of the list stays empty.
 * The user resizes the list and the detail; the space at the right of the
 * detail stays empty. On a small viewport, the detail goes over the list.
 * The widths come from the ListDetailWidthsProvider of the app.
 */
function ListDetailSplit({ detail, children }: ListDetailSplitProps) {
  const panel = detail?.panel;
  const onCloseDetail = detail?.onClose ?? noop;
  const {
    listWidth,
    onListWidthChange,
    detailWidth: storedDetailWidth,
    onDetailWidthChange,
  } = useListDetailWidths();
  const { matches: isOverlay } = useMediaQuery(OVERLAY_MEDIA_QUERY);
  const isOpen = Boolean(panel);

  // The width of the split, for the largest width of the list
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  useEffect(() => {
    if (!container) return undefined;

    const observer = new ResizeObserver(() => {
      setContainerWidth(container.offsetWidth);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);

  // The width of the detail while the user drags its sash
  const [dragDetailWidth, setDragDetailWidth] = useState<number>();
  const detailWidth =
    dragDetailWidth ?? storedDetailWidth ?? DEFAULT_DETAIL_WIDTH;
  // Where the drag started, and the last width of the drag
  const dragStart = useRef<{ x: number; width: number; last?: number }>({
    x: 0,
    width: 0,
  });

  const handleDetailDragStart = useCallback(
    (x: number) => {
      dragStart.current = { x, width: detailWidth, last: undefined };
    },
    [detailWidth],
  );

  const handleDetailDragMove = useCallback((x: number) => {
    const { x: startX, width } = dragStart.current;
    const newWidth = Math.max(MIN_DETAIL_WIDTH, width + x - startX);
    dragStart.current.last = newWidth;
    setDragDetailWidth(newWidth);
  }, []);

  const handleDetailDragEnd = useCallback(() => {
    const { last } = dragStart.current;
    if (last !== undefined) onDetailWidthChange(last);
    setDragDetailWidth(undefined);
  }, [onDetailWidthChange]);

  const maxListWidth =
    containerWidth === undefined
      ? undefined
      : Math.max(MIN_LIST_WIDTH, containerWidth - MIN_DETAIL_WIDTH);

  const firstListWidth =
    containerWidth === undefined
      ? MAX_FIRST_LIST_WIDTH
      : Math.max(
          MIN_LIST_WIDTH,
          Math.min(MAX_FIRST_LIST_WIDTH, containerWidth - DEFAULT_DETAIL_WIDTH),
        );

  const size = Math.min(
    listWidth ?? firstListWidth,
    maxListWidth ?? Number.POSITIVE_INFINITY,
  );

  // As the button on the border of the sidebar of a record, the button that
  // hides the detail over the list shows only while the pointer is in the
  // detail
  const hideButton = useSashActionReveal(isOpen && isOverlay);

  const list = (
    <DetailOpenContext.Provider value={isOpen}>
      {children}
    </DetailOpenContext.Provider>
  );

  return (
    <HotKeyListener
      hotKey="escape"
      description={{ id: 'hotkeys.closeModal' }}
      trigger={onCloseDetail}
      enabled={isOpen}
    >
      <div
        ref={setContainer}
        className={classNames('ListDetailSplit', {
          'ListDetailSplit--open': isOpen,
          'ListDetailSplit--overlay': isOverlay,
        })}
      >
        {isOverlay ? (
          <>
            <div className="ListDetailSplit__list">{list}</div>
            {isOpen && (
              <div
                className="ListDetailSplit__detail"
                {...hideButton.paneHoverProps}
              >
                <SplitView.Sash
                  split="vertical"
                  allowResize={false}
                  style={SASH_STYLE}
                  onMouseDown={noop}
                  onMouseMove={noop}
                  onMouseUp={noop}
                  action={{
                    icon: Navigation.ChevronsRightIcon,
                    label: { id: 'admin.listDetail.panel.close' },
                    onClick: onCloseDetail,
                    revealFrom: 'right',
                    hidden: !hideButton.isVisible,
                  }}
                />
                <OverlayCloseContext.Provider value={onCloseDetail}>
                  {panel}
                </OverlayCloseContext.Provider>
              </div>
            )}
          </>
        ) : (
          <SplitPane
            primaryPane="right"
            size={size}
            minSize={MIN_LIST_WIDTH}
            maxSize={maxListWidth}
            onDragFinished={onListWidthChange}
          >
            {list}
            {isOpen ? (
              <div
                className="ListDetailSplit__detail"
                style={{ width: detailWidth }}
              >
                <SplitView.Sash
                  split="vertical"
                  allowResize={true}
                  style={DETAIL_SASH_STYLE}
                  onMouseDown={handleDetailDragStart}
                  onMouseMove={handleDetailDragMove}
                  onMouseUp={handleDetailDragEnd}
                />
                {panel}
              </div>
            ) : null}
          </SplitPane>
        )}
      </div>
    </HotKeyListener>
  );
}

export default React.memo(ListDetailSplit);
