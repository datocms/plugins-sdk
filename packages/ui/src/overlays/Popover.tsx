import {
  autoUpdate,
  flip,
  Middleware,
  OffsetOptions,
  offset,
  Placement,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import mergeRefs from '@react-hook/merged-ref';
import React, { ReactNode, useEffect, useRef } from 'react';
import { HotKeyListener, HotKeyStack } from '../actions/HotKey';
import { useClickOutside } from '../hooks/useClickOutside';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import NewZIndex from './NewZIndex';
import Portal from './Portal';

export type PopoverProps = {
  /** The content that floats near the anchor. */
  children?: ReactNode;
  /** The element that the content follows. */
  anchorElement: Element;
  /**
   * The side of the anchor where the content shows. It moves to the other
   * side when there is no space.
   * @default "top"
   */
  placement?: Placement;
  /**
   * The distance to the anchor, in pixels or as a Floating UI offset object.
   * @default { mainAxis: 16 }
   */
  offset?: OffsetOptions;
  /**
   * Runs when the user presses Escape or clicks out of the popover. A click
   * on the anchor does not run it, because the anchor opens and closes the
   * popover. Without it, the popover stays open until the caller removes it.
   */
  onClose?: () => void;
  /**
   * The name of the popover for a screen reader. With it, the popover has
   * `role="dialog"`. Give it when the popover has controls, for example a
   * picker.
   */
  ariaLabel?: TextMessage;
  /**
   * The focus goes into the popover when it opens, and comes back to where
   * it was when the popover closes. Give it when the user opens the popover
   * with a button or a key. Do not give it when the popover opens from a
   * field where the user types.
   */
  autoFocus?: boolean;
};

// Tooltip, HoverCard and the menus of Dropdown have their own Floating UI
// code for their interactions, but they use this middleware too.
export function floatingMiddleware(offsetOptions: OffsetOptions): Middleware[] {
  return [
    offset(offsetOptions),
    flip(),
    shift({ padding: 8 }),
    // Tall content can use --Popover-available-height as its maximum height.
    size({
      padding: 8,
      apply({ availableHeight, elements }) {
        elements.floating.style.setProperty(
          '--Popover-available-height',
          `${availableHeight}px`,
        );
      },
    }),
  ];
}

/**
 * Content that floats near an element, over the page. It has no box of its
 * own: the content draws it. Menus, tooltips and hover cards have their own
 * components.
 */
function Popover({
  anchorElement,
  placement = 'top',
  offset: offsetOptions = { mainAxis: 16 },
  onClose,
  ariaLabel,
  autoFocus,
  children,
}: PopoverProps) {
  const { tm } = useTranslation();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const { refs, floatingStyles } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware(offsetOptions),
  });

  useEffect(() => refs.setReference(anchorElement), [anchorElement]);

  const clickOutsideRef = useClickOutside<HTMLDivElement>((event) => {
    if (
      !onClose ||
      (event.target instanceof Node && anchorElement.contains(event.target))
    ) {
      return;
    }

    onClose();
  });

  const floatingRef = mergeRefs(refs.setFloating, clickOutsideRef, dialogRef);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const previous = document.activeElement;
    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      // A click out of the popover moves the focus to the element that the
      // user clicked: the focus stays there.
      if (!document.activeElement || document.activeElement === document.body) {
        (previous as HTMLElement | null)?.focus?.();
      }
    };
  }, [autoFocus]);

  const content = (
    <Portal>
      <NewZIndex>
        {(zIndex) => (
          <div
            ref={floatingRef}
            style={{
              ...floatingStyles,
              zIndex,
              boxShadow: autoFocus ? 'none' : undefined,
            }}
            tabIndex={autoFocus ? -1 : undefined}
            role={ariaLabel ? 'dialog' : undefined}
            aria-label={ariaLabel ? tm(ariaLabel) : undefined}
          >
            {children}
          </div>
        )}
      </NewZIndex>
    </Portal>
  );

  if (!onClose) {
    return content;
  }

  // The popover is a layer of keys: Escape closes it, and a modal under it
  // stays open.
  return (
    <HotKeyStack>
      <HotKeyListener
        hotKey="escape"
        description={{ id: 'hotkeys.closePopover' }}
        trigger={onClose}
      >
        {content}
      </HotKeyListener>
    </HotKeyStack>
  );
}

export default Popover;
