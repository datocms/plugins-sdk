import classNames from 'classnames';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Misc } from '../../../icons';
import { useRegisterActions } from '../../actions/Actions/registry';
import BlankSlate from '../../feedback/BlankSlate';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CollectionRegionProvider } from '../../layout/Pane/PaneRegion';
import SplitPane, {
  TOGGLE_RIGHT_SIDEBAR_ACTION_ID,
} from '../../layout/SplitPane';
import SplitView from '../../layout/SplitView/SplitView';
import FloatingDetail from './FloatingDetail';
import {
  DEFAULT_DETAIL_WIDTH,
  MIN_DETAIL_WIDTH,
  useDetailWidthDrag,
} from './useDetailWidthDrag';
import { useListDetailWidths } from './Widths';

// The smallest width of the list
const MIN_LIST_WIDTH = 360;

// Before the user resizes the list, the list takes the width that leaves
// the detail its default width, but not more than this. A resize of the
// detail does not move the list.
const MAX_FIRST_LIST_WIDTH = 1100;

// The sash of the detail is on its right border
const DETAIL_SASH_STYLE: React.CSSProperties = {
  left: 'auto',
  right: -5,
  width: 10,
  zIndex: 2,
};

// Below this viewport width, the detail always goes over the list
export const CLOSE_DETAIL_ACTION_ID = 'listDetail.close';

const NARROW_VIEWPORT_MEDIA_QUERY = '(max-width: 1100px)';

const noop = () => {};

const EMPTY_DETAIL_TITLE = { id: 'admin.listDetail.panel.empty.title' };
const EMPTY_DETAIL_DESCRIPTION = {
  id: 'admin.listDetail.panel.empty.description',
};

const DetailOpenContext = createContext(false);

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

/** Where the panel of the open row goes */
export type ListDetailPlacement = 'beside' | 'over';

/** The detail of the open row */
export type ListDetailSplitDetail = {
  /** The panel of the open row (a ListDetail.Panel). Without it, no row is open. */
  panel?: React.ReactNode;
  /**
   * Closes the open row. Escape, `]` and, when the panel goes over the
   * list, the close button of the panel and a click on an empty part of the
   * list run it.
   */
  onClose: () => void;
  /**
   * Opens the last open row again, while no row is open. Without it, `]`
   * only closes the open row.
   */
  onReopen?: () => void;
  /**
   * Where the panel goes. "beside": on the right of the list, and the list
   * keeps a part of the width for the panel. Use it for a table with few,
   * narrow columns. "over": the list takes all the width, and the open
   * panel goes over the right part of the list. Use it for a table that
   * needs the width. Below 1100px of window width, the panel always goes
   * over the list. There is no default: choose the placement for each list.
   */
  placement: ListDetailPlacement;
};

export type ListDetailSplitProps = {
  /** The rows open a detail on the right. Without it, the list is alone. */
  detail?: ListDetailSplitDetail;
  /** The list: a Pane */
  children: React.ReactNode;
};

function useElementWidth() {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback((node: HTMLDivElement | null) => {
    ref.current = node;
    setElement(node);
  }, []);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    if (!element) return undefined;

    const observer = new ResizeObserver(() => {
      setWidth(element.offsetWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { ref, setRef, width };
}

function useDetailActions(
  isOpen: boolean,
  onClose: () => void,
  onReopen: (() => void) | undefined,
) {
  useRegisterActions([
    {
      id: CLOSE_DETAIL_ACTION_ID,
      name: { id: 'admin.listDetail.panel.close' },
      shortcut: { key: 'escape' },
      palette: 'hidden',
      applicable: () => isOpen,
      run: onClose,
    },
    {
      id: TOGGLE_RIGHT_SIDEBAR_ACTION_ID,
      name: { id: 'sidebar.toggleRight' },
      icon: Misc.SidebarFlipIcon,
      shortcut: { key: ']' },
      applicable: () => isOpen || Boolean(onReopen),
      run: () => (isOpen ? onClose() : onReopen?.()),
    },
  ]);
}

/**
 * A list on the left and the detail of the open row on the right, as the
 * records of a model in DatoCMS. The list keeps its place and its width when
 * a row opens or closes, so the user does not lose the row.
 * With the "beside" placement, the user resizes the list and the detail, and
 * the space on the right of the detail stays empty. When no row is open, the
 * space of the detail shows a blank slate that says to open a row.
 * With the "over" placement, and on a small viewport, the list takes all the
 * width and the open detail goes over it.
 * The widths come from the ListDetailWidthsProvider of the host.
 */
function ListDetailSplit({ detail, children }: ListDetailSplitProps) {
  const panel = detail?.panel;
  const onCloseDetail = detail?.onClose ?? noop;
  const isOpen = Boolean(panel);
  const { matches: isNarrowViewport } = useMediaQuery(
    NARROW_VIEWPORT_MEDIA_QUERY,
  );
  const placement: ListDetailPlacement = isNarrowViewport
    ? 'over'
    : (detail?.placement ?? 'beside');
  const container = useElementWidth();

  useDetailActions(isOpen, onCloseDetail, detail?.onReopen);

  const list = (
    <DetailOpenContext.Provider value={isOpen}>
      <CollectionRegionProvider value={container.ref}>
        {children}
      </CollectionRegionProvider>
    </DetailOpenContext.Provider>
  );

  return (
    <div
      ref={container.setRef}
      className={classNames('ListDetailSplit', {
        'ListDetailSplit--open': isOpen,
        'ListDetailSplit--over': placement === 'over',
      })}
    >
      {placement === 'over' ? (
        <>
          <div className="ListDetailSplit__list">{list}</div>
          {isOpen && (
            <FloatingDetail
              panel={panel}
              onClose={onCloseDetail}
              resizable={!isNarrowViewport}
              containerWidth={container.width}
              container={container.ref}
            />
          )}
        </>
      ) : (
        <BesideSplit
          containerWidth={container.width}
          detail={detail}
          list={list}
        />
      )}
    </div>
  );
}

type BesideSplitProps = {
  containerWidth: number | undefined;
  detail: ListDetailSplitDetail | undefined;
  list: React.ReactNode;
};

function BesideSplit({ containerWidth, detail, list }: BesideSplitProps) {
  const panel = detail?.panel;
  const { listWidth, onListWidthChange } = useListDetailWidths();
  const { width: detailWidth, sashHandlers } = useDetailWidthDrag({
    sashSide: 'right',
  });

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

  return (
    <SplitPane
      primaryPane="right"
      size={size}
      minSize={MIN_LIST_WIDTH}
      maxSize={maxListWidth}
      onDragFinished={onListWidthChange}
    >
      {list}
      {panel ? (
        <div className="ListDetailSplit__detail" style={{ width: detailWidth }}>
          <SplitView.Sash
            split="vertical"
            allowResize={true}
            style={DETAIL_SASH_STYLE}
            {...sashHandlers}
          />
          {panel}
        </div>
      ) : detail ? (
        <div
          className="ListDetailSplit__detail ListDetailSplit__detail--empty"
          style={{ width: detailWidth }}
        >
          <BlankSlate
            placement="area"
            small
            icon={<Misc.SquareDashedIcon />}
            title={EMPTY_DETAIL_TITLE}
            description={EMPTY_DETAIL_DESCRIPTION}
          />
        </div>
      ) : null}
    </SplitPane>
  );
}

export default React.memo(ListDetailSplit);
