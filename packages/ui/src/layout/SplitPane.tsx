import classNames from 'classnames';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Generic, Misc, Navigation } from '../../icons/index';
import { ActionTooltip } from '../actions/Actions/ActionTooltip';
import { useRegisterActions } from '../actions/Actions/registry';
import { useTranslation } from '../i18n';
import NewZIndex from '../overlays/NewZIndex';
import RawButton from '../semantic/RawButton';
import { mouseHoverProps } from '../utils/mouseHoverProps';
import { CollectionRegionProvider } from './Pane/PaneRegion';
import { useSashActionReveal } from './SplitView/SashActionButton';
import SplitView, { type PaneBox } from './SplitView/SplitView';
export type SplitPaneProps = {
  /**
   * "split" puts the two panes side by side. "overlay" shows the secondary
   * pane over the page, for example on a small viewport. The caller
   * computes it, because its own controls use the same breakpoint.
   * @default "split"
   */
  mode?: 'overlay' | 'split';
  /**
   * The smallest width of the secondary pane.
   * @default 200
   */
  minSize?: SplitPaneSize;
  /** The largest width of the secondary pane, for example 360 or "60%". */
  maxSize?: SplitPaneSize;
  /**
   * The width of the secondary pane. The user can change it with a drag of
   * the sash.
   * @default 220
   */
  size?: SplitPaneSize;
  /**
   * The pane that takes the free space. The other pane is the secondary
   * pane: it has the width of `size`, the collapse button and the rail.
   */
  primaryPane: 'left' | 'right';
  /**
   * Lets the secondary pane collapse: the sash gets a button, and the
   * collapsed pane leaves a rail. In `overlay` mode, the pane closes on a
   * click out of it and on Escape.
   */
  collapse?: SplitPaneCollapse;
  /** Exactly two children: the left pane and the right pane */
  children: [React.ReactNode, React.ReactNode];
  /** Runs at the end of a drag, with the new width in pixels */
  onDragFinished?: (newSize: number) => void;
};

/**
 * A width: a number is in pixels, and "N%" is a percentage of the width of
 * the whole split pane.
 */
export type SplitPaneSize = number | `${number}%`;

export type SplitPaneCollapse = {
  /** Tells if the secondary pane is open. */
  open: boolean;
  /**
   * Runs with the new state: `true` when the pane opens, `false` when it
   * collapses.
   */
  onToggle: (open: boolean) => void;
  /**
   * Hides the rail of the collapsed pane. Use it when the app gives another
   * control that opens the pane, for example the menu button of the mobile
   * header.
   * @default false
   */
  hideRail?: boolean;
  /**
   * Puts the toggle (the button on the sash or the icon of the rail) in an
   * element of the app, for example a spotlight that tells the user about
   * the toggle.
   */
  wrapToggle?: (toggle: React.ReactElement) => React.ReactNode;
};

type Size = string | number;

export const TOGGLE_LEFT_SIDEBAR_ACTION_ID = 'sidebar.toggleLeft';

export const TOGGLE_RIGHT_SIDEBAR_ACTION_ID = 'sidebar.toggleRight';

// The width of the secondary pane when the caller gives no size. The cms
// also uses it as the first value of the width that it keeps.
export const DEFAULT_SECONDARY_SIZE = 220;

const InSecondaryPaneContext = createContext(false);

// The secondary pane is narrow, thus its content must use less space (for
// example, buttons with only an icon).
export function useIsInSecondaryPane() {
  return useContext(InSecondaryPaneContext);
}

const SecondaryPaneMinSizeContext = createContext<
  ((minSize: number | undefined) => void) | undefined
>(undefined);

// The content of the secondary pane asks for a larger width while it needs
// it (for example, a sidebar in edit mode with more buttons in its title
// bar). The pane is at least `minSize` pixels wide until the value is
// undefined or the content unmounts. Then the pane gets its width again. The
// width that the user keeps does not change. Out of a secondary pane, and
// with a size in percent, the hook does nothing.
export function useSecondaryPaneMinSize(minSize: number | undefined) {
  const setMinSize = useContext(SecondaryPaneMinSizeContext);

  useEffect(() => {
    if (!setMinSize || minSize === undefined) return;

    setMinSize(minSize);
    return () => setMinSize(undefined);
  }, [setMinSize, minSize]);
}

// In ms. The root gives it to the CSS as --SplitPane-size-duration.
const SIZE_ANIMATION_DURATION = 200;

// In px. The root gives it to the CSS as --SplitPane-rail-size.
const RAIL_SIZE = 40;

const ROOT_STYLE = {
  '--SplitPane-rail-size': `${RAIL_SIZE}px`,
  '--SplitPane-size-duration': `${SIZE_ANIMATION_DURATION}ms`,
} as React.CSSProperties;

function calculateSizes({
  size,
  primaryPane,
  isSecondaryCollapsed,
  isOverlayModeActive,
  showsRail,
}: {
  size: SplitPaneSize;
  primaryPane: 'left' | 'right';
  isSecondaryCollapsed?: boolean;
  isOverlayModeActive?: boolean;
  showsRail: boolean;
}): Size[] {
  const realSize =
    isSecondaryCollapsed || isOverlayModeActive
      ? showsRail
        ? RAIL_SIZE
        : 0
      : size;
  return primaryPane === 'right' ? [realSize] : ['auto', realSize];
}

/**
 * Two panes side by side: the primary pane takes the free space, and the
 * secondary pane has a width that the user can change. The secondary pane
 * can collapse to a rail, and it can show as an overlay.
 */
// The secondary pane's content (the record sidebar, with its plugin iframes)
// lives in ONE place in the tree, a host that the SplitView renders after its
// panes and sashes, in both modes. If the content moves between the overlay
// and the pane on a breakpoint change, its DOM detaches, and a detached iframe
// reloads. In split mode, the host is over the (empty) secondary
// SplitViewPane. In overlay mode, the same host is the floating panel.
//
// The SplitView gives the host the same position and size that it gives to
// the pane. We do not measure the DOM: a measurement includes the transforms
// of the ancestors (for example, the scale animation of a modal that opens),
// and no observer runs again when such a transform stops. Thus a measured box
// can stay incorrect, and the sidebar then shows in the wrong place, or does
// not show.
export default function SplitPane({
  mode = 'split',
  minSize: minSizeProp = 200,
  maxSize,
  size: sizeProp = DEFAULT_SECONDARY_SIZE,
  primaryPane,
  children,
  onDragFinished,
  collapse,
}: SplitPaneProps) {
  const { t } = useTranslation();
  const isSecondaryCollapsed = collapse ? !collapse.open : false;
  const showsRail = Boolean(collapse) && !collapse?.hideRail;

  // See useSecondaryPaneMinSize
  const [requestedMinSize, setRequestedMinSize] = useState<number>();
  // The width changes with an animation when the content asks for a larger
  // width, and when it stops. A drag changes the width with no animation.
  const [isSizeAnimated, setSizeAnimated] = useState(false);

  // The class of the animation and the new width are in the same render.
  // Thus the transition starts from the old width.
  const requestMinSize = useCallback((minSize: number | undefined) => {
    setRequestedMinSize(minSize);
    setSizeAnimated(true);
  }, []);

  useEffect(() => {
    if (!isSizeAnimated) return;

    const timer = setTimeout(
      () => setSizeAnimated(false),
      SIZE_ANIMATION_DURATION,
    );
    return () => clearTimeout(timer);
  }, [isSizeAnimated]);
  const size =
    requestedMinSize !== undefined && typeof sizeProp === 'number'
      ? Math.max(sizeProp, requestedMinSize)
      : sizeProp;
  const minSize =
    requestedMinSize !== undefined && typeof minSizeProp === 'number'
      ? Math.max(minSizeProp, requestedMinSize)
      : minSizeProp;
  const isOverlayModeActive = useMemo(() => mode === 'overlay', [mode]);

  const isSecondaryDocked = !isSecondaryCollapsed && !isOverlayModeActive;

  const baseSizes = useMemo(
    () =>
      calculateSizes({
        size,
        primaryPane,
        isSecondaryCollapsed,
        isOverlayModeActive,
        showsRail,
      }),
    [size, primaryPane, isSecondaryCollapsed, isOverlayModeActive, showsRail],
  );
  // The sizes that a drag sets. They apply only to the base sizes from which
  // the drag started: when the props change, the props win. Thus the first
  // render after the pane opens has the open sizes. (With an effect, that
  // render has the collapsed sizes, and the host of the pane shows the
  // minimum width for one frame.)
  const [dragSizes, setDragSizes] = useState<{ from: Size[]; sizes: Size[] }>();
  const sizes = dragSizes?.from === baseSizes ? dragSizes.sizes : baseSizes;
  const currentSizes = useRef<Size[]>(sizes);
  const isCollapsedByDrag = useRef(false);

  const SashActionIcon = collapse
    ? primaryPane === 'left'
      ? isSecondaryCollapsed
        ? Misc.SidebarFlipIcon
        : Navigation.ChevronsRightIcon
      : isSecondaryCollapsed
        ? Navigation.ChevronsRightIcon
        : Navigation.ChevronsLeftIcon
    : undefined;

  const secondarySide = primaryPane === 'left' ? 'right' : 'left';
  const secondaryIndex = primaryPane === 'left' ? 1 : 0;
  const canPeek = isSecondaryCollapsed;
  const { isPeeking, schedulePeek, stopPeek } = usePeek(canPeek);

  function handleChange(newSizes: Size[]) {
    setDragSizes({ from: baseSizes, sizes: newSizes });
    currentSizes.current = newSizes;
  }

  function handleDragEnd() {
    // A drag that collapses the pane must not keep its last width: the pane
    // must open again at the width that it had before the drag.
    if (isCollapsedByDrag.current) {
      isCollapsedByDrag.current = false;
      return;
    }
    onDragFinished?.(currentSizes.current[secondaryIndex] as number);
  }

  function handleCollapseByDrag() {
    isCollapsedByDrag.current = true;
    collapse?.onToggle(false);
  }

  function handleSecondaryClick() {
    stopPeek();
    // The argument is the new state: a collapsed pane opens, an open pane
    // collapses
    collapse?.onToggle(Boolean(isSecondaryCollapsed));
  }

  function handleEscape() {
    if (isPeeking) {
      stopPeek();
      return;
    }
    handleSecondaryClick();
  }

  // The collapse button on the sash shows only while the pointer is in the
  // open pane (or on the button)
  const sashActionReveal = useSashActionReveal(isSecondaryDocked);

  const railDrag = useRailDrag(secondarySide, () => {
    stopPeek();
    collapse?.onToggle(true);
  });

  const isSecondaryVisible = !isSecondaryCollapsed || isPeeking;
  const isFloating = (isOverlayModeActive && isSecondaryVisible) || isPeeking;

  useRegisterActions([
    {
      id: 'splitPane.closeFloating',
      name: { id: 'sidebar.hide' },
      shortcut: { key: 'escape' },
      palette: 'hidden',
      applicable: () => isFloating,
      run: handleEscape,
    },
  ]);

  const rootRef = useRef<HTMLDivElement>(null);
  const secondaryHostRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLButtonElement>(null);
  const toggleActionId =
    secondarySide === 'left'
      ? TOGGLE_LEFT_SIDEBAR_ACTION_ID
      : TOGGLE_RIGHT_SIDEBAR_ACTION_ID;
  const focusRailOnCollapse = useFocusRailOnCollapse(
    Boolean(isSecondaryCollapsed),
    railRef,
  );
  useRegisterActions(
    collapse
      ? [
          {
            id: toggleActionId,
            name: {
              id:
                secondarySide === 'left'
                  ? 'sidebar.toggleLeft'
                  : 'sidebar.toggleRight',
            },
            icon:
              secondarySide === 'left'
                ? Generic.SidebarIcon
                : Misc.SidebarFlipIcon,
            shortcut: { key: secondarySide === 'left' ? '[' : ']' },
            run: () => {
              // The pane that collapses takes the focus away: the rail gets it
              if (secondaryHostRef.current?.contains(document.activeElement)) {
                focusRailOnCollapse();
              }
              handleSecondaryClick();
            },
          },
        ]
      : [],
  );

  const railLabel = isPeeking
    ? 'sidebar.keepOpen'
    : isSecondaryCollapsed
      ? 'sidebar.show'
      : 'sidebar.hide';

  function renderRail(pane: 'left' | 'right') {
    // The tooltip and the spotlight go around the icon, not around the rail:
    // the rail is as tall as the page, and the wrapper of the spotlight is an
    // inline element, while the rail must fill the pane.
    const icon = SashActionIcon && (
      <ActionTooltip
        action={toggleActionId}
        label={{ id: railLabel }}
        placement={pane === 'left' ? 'right' : 'left'}
      >
        <span className="SplitPane__rail__icon">
          <SashActionIcon />
        </span>
      </ActionTooltip>
    );
    const railIcon =
      icon && collapse?.wrapToggle ? collapse.wrapToggle(icon) : icon;

    return (
      <RawButton
        ref={railRef}
        className={classNames(
          'SplitPane__rail',
          `SplitPane__rail--${pane}`,
          isFloating && 'SplitPane__rail--active',
        )}
        ariaLabel={t(railLabel)}
        expandable={{ open: !isSecondaryCollapsed }}
        onClick={() => {
          if (railDrag.consumeClick()) return;
          handleSecondaryClick();
        }}
        onPointerDown={railDrag.onPointerDown}
        {...mouseHoverProps((isHovered) => schedulePeek(isHovered && canPeek))}
      >
        {railIcon}
      </RawButton>
    );
  }

  function renderPane(pane: 'left' | 'right') {
    const isSecondaryPane = primaryPane !== pane;

    if (!isSecondaryPane) {
      // A split view in a secondary pane can have a wide primary pane
      return (
        <SplitView.Pane>
          <InSecondaryPaneContext.Provider value={false}>
            <SecondaryPaneMinSizeContext.Provider value={undefined}>
              <CollectionRegionProvider value={undefined}>
                {children[pane === 'left' ? 0 : 1]}
              </CollectionRegionProvider>
            </SecondaryPaneMinSizeContext.Provider>
          </InSecondaryPaneContext.Provider>
        </SplitView.Pane>
      );
    }

    return (
      <SplitView.Pane
        {...(isSecondaryCollapsed || isOverlayModeActive
          ? {}
          : { minSize, maxSize })}
      >
        {!isSecondaryDocked && showsRail && renderRail(pane)}
      </SplitView.Pane>
    );
  }

  function renderSecondaryHost(panes: PaneBox[], baseZIndex: number) {
    if (!isSecondaryVisible) return null;

    return (
      <div
        ref={secondaryHostRef}
        className={
          isFloating
            ? classNames(
                'SplitPaneOverlay',
                showsRail && `SplitPaneOverlay--${secondarySide}`,
                isPeeking && 'SplitPaneOverlay--peek',
              )
            : 'SplitPane__secondary-host'
        }
        onClick={isFloating && !isPeeking ? handleSecondaryClick : undefined}
        {...(isFloating ? {} : sashActionReveal.paneHoverProps)}
        // The overlay of an outer split pane shows over the overlay of an
        // inner one. NewZIndex gives a higher value to an inner layer, thus
        // the overlay uses the inverse. The value stays under the dialogs.
        style={
          isFloating
            ? { zIndex: 20000 - baseZIndex }
            : {
                left: panes[secondaryIndex]?.start,
                width: panes[secondaryIndex]?.size,
              }
        }
      >
        <div
          className={
            isFloating
              ? classNames(
                  'SplitPaneOverlay__secondary',
                  `SplitPaneOverlay__secondary--${secondarySide}`,
                )
              : 'SplitPane__secondary-host__pane'
          }
          style={
            isFloating
              ? {
                  width: size,
                  maxWidth: maxSize,
                  minWidth: minSize,
                }
              : undefined
          }
          onClick={
            isFloating
              ? (e) => {
                  e.stopPropagation();
                }
              : undefined
          }
          {...(isPeeking ? mouseHoverProps(schedulePeek) : {})}
        >
          <InSecondaryPaneContext.Provider value={true}>
            <SecondaryPaneMinSizeContext.Provider value={requestMinSize}>
              <CollectionRegionProvider value={rootRef}>
                {children[secondaryIndex]}
              </CollectionRegionProvider>
            </SecondaryPaneMinSizeContext.Provider>
          </InSecondaryPaneContext.Provider>
        </div>
      </div>
    );
  }

  return (
    <NewZIndex>
      {(baseZIndex) => (
        <div
          ref={rootRef}
          className={classNames(
            'SplitPane',
            isSizeAnimated && 'SplitPane--size-animated',
          )}
          style={ROOT_STYLE}
        >
          <SplitView
            allowResize={isSecondaryDocked}
            sizes={sizes}
            onChange={handleChange}
            onDragEnd={handleDragEnd}
            sashZIndex={SashActionIcon ? 10 : undefined}
            // When the pane is not docked, the rail holds the toggle, thus
            // the sash between the panes has no button
            sashAction={
              SashActionIcon && isSecondaryDocked
                ? {
                    icon: SashActionIcon,
                    label: { id: 'sidebar.hide' },
                    expandable: { open: true },
                    action: toggleActionId,
                    wrap: collapse?.wrapToggle,
                    onClick: handleSecondaryClick,
                    hidden: !sashActionReveal.isVisible,
                    revealFrom: secondarySide,
                    onHoverChange: sashActionReveal.onActionHoverChange,
                  }
                : undefined
            }
            collapsiblePaneIndex={collapse ? secondaryIndex : undefined}
            onCollapseByDrag={collapse ? handleCollapseByDrag : undefined}
            renderOverPanes={(panes) => renderSecondaryHost(panes, baseZIndex)}
          >
            {renderPane('left')}
            {renderPane('right')}
          </SplitView>
        </div>
      )}
    </NewZIndex>
  );
}

// The rail shows after the render that collapses the pane, thus the focus
// moves to it in an effect
function useFocusRailOnCollapse(
  isCollapsed: boolean,
  railRef: React.RefObject<HTMLButtonElement | null>,
) {
  const pending = useRef(false);

  useEffect(() => {
    if (!isCollapsed || !pending.current) return;
    pending.current = false;
    railRef.current?.focus();
  }, [isCollapsed, railRef]);

  return useCallback(() => {
    pending.current = true;
  }, []);
}

// In ms. Without this delay, a pointer that only crosses the rail opens the
// pane.
const PEEK_OPEN_DELAY = 200;
// In ms. This delay lets the pointer go from the rail to the pane (and back)
// without a flicker.
const PEEK_CLOSE_DELAY = 300;

// This hook controls the "peek": while the pane is collapsed, the pointer on the rail
// shows the pane over the page. The pane goes away when the pointer leaves.
function usePeek(canPeek: boolean) {
  const [isPeeking, setPeeking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stopPeek = useCallback(() => {
    clearTimeout(timer.current);
    setPeeking(false);
  }, []);

  const schedulePeek = useCallback((open: boolean) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setPeeking(open),
      open ? PEEK_OPEN_DELAY : PEEK_CLOSE_DELAY,
    );
  }, []);

  useEffect(() => {
    if (!canPeek) stopPeek();
  }, [canPeek, stopPeek]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { isPeeking: isPeeking && canPeek, schedulePeek, stopPeek };
}

// The distance that the pointer must move away from the rail, toward the
// page, before the drag opens the pane.
const RAIL_DRAG_THRESHOLD = 24;

function useRailDrag(side: 'left' | 'right', onOpen: () => void) {
  const suppressClick = useRef(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const startX = e.clientX;
      suppressClick.current = false;

      const handleMove = (moveEvent: PointerEvent) => {
        const distance =
          side === 'left'
            ? moveEvent.clientX - startX
            : startX - moveEvent.clientX;
        if (distance < RAIL_DRAG_THRESHOLD) return;

        suppressClick.current = true;
        cleanUp();
        onOpenRef.current();
      };

      const cleanUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', cleanUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', cleanUp);
    },
    [side],
  );

  const consumeClick = useCallback(() => {
    const result = suppressClick.current;
    suppressClick.current = false;
    return result;
  }, []);

  return { onPointerDown, consumeClick };
}
