import React, { createContext, useContext, useEffect, useRef } from 'react';
import SplitView from '../../layout/SplitView/SplitView';
import { MIN_DETAIL_WIDTH, useDetailWidthDrag } from './useDetailWidthDrag';

// The sash is on the left border of the detail, as wide as the sash of a
// SplitView, and over the content of the detail
const SASH_STYLE: React.CSSProperties = { left: -5, width: 10, zIndex: 2 };

// A drag cannot make the detail wider than this part of the list
const MIN_VISIBLE_LIST_WIDTH = 360;

// The close of the detail over the list. The panel then shows a close
// button, because its sash has no button.
const OverlayCloseContext = createContext<(() => void) | undefined>(undefined);

export function useListDetailOverlayClose() {
  return useContext(OverlayCloseContext);
}

// A click on one of these elements does its own job (a row opens its
// detail), thus it does not close the detail. An element with tabindex -1
// (the content of a Pane) only takes the focus from the code: it is not
// interactive.
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [tabindex]:not([tabindex="-1"]), [role="button"], [role="option"], [role="menuitem"]';

/**
 * Closes the detail on a click in the list area that is not on an
 * interactive element. A click in a portal (a menu, a dialog) is out of the
 * area, so it does not close the detail.
 */
function useCloseOnEmptyClick(
  area: React.RefObject<HTMLElement | null>,
  detail: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const areaElement = area.current;
    if (!areaElement) return undefined;

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (detail.current?.contains(target)) return;
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      onClose();
    }

    areaElement.addEventListener('click', handleClick);
    return () => areaElement.removeEventListener('click', handleClick);
  }, [area, detail, onClose]);
}

type Props = {
  // The open panel (a ListDetail.Panel)
  panel: React.ReactNode;
  onClose: () => void;
  // A resizable detail takes the stored width of the detail. Else, its
  // width comes from the CSS.
  resizable: boolean;
  // The width of the split, or undefined before the first measurement
  containerWidth: number | undefined;
  // The split: a click in it, out of the detail, can close the detail
  container: React.RefObject<HTMLElement | null>;
};

/**
 * The detail over the list, at its right. The list keeps all the width and
 * stays usable: a click on another row changes the detail. So there is
 * no backdrop and no focus trap. A click on an empty part of the list closes
 * the detail.
 */
function ListDetailFloatingDetail({
  panel,
  onClose,
  resizable,
  containerWidth,
  container,
}: Props) {
  const detailRef = useRef<HTMLDivElement>(null);
  useCloseOnEmptyClick(container, detailRef, onClose);

  const { width, sashHandlers } = useDetailWidthDrag({
    sashSide: 'left',
    maxWidth:
      containerWidth === undefined
        ? undefined
        : Math.max(MIN_DETAIL_WIDTH, containerWidth - MIN_VISIBLE_LIST_WIDTH),
  });

  return (
    <div
      ref={detailRef}
      className="ListDetailSplit__detail"
      style={resizable ? { width } : undefined}
    >
      {resizable && (
        <SplitView.Sash
          split="vertical"
          allowResize={true}
          style={SASH_STYLE}
          {...sashHandlers}
        />
      )}
      <OverlayCloseContext.Provider value={onClose}>
        {panel}
      </OverlayCloseContext.Provider>
    </div>
  );
}

export default React.memo(ListDetailFloatingDetail);
