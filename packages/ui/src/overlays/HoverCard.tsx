import {
  autoUpdate,
  type OffsetOptions,
  type Placement,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import React, { ReactNode, useState } from 'react';
import { cloneTrigger, type FloatingTrigger } from './floatingTrigger';
import NewZIndex from './NewZIndex';
import { floatingMiddleware } from './Popover';
import Portal from './Portal';

// The pointer must stay on the trigger for this time before the card opens.
// Thus the card does not open while the pointer only moves over a list.
const HOVER_CARD_DELAY = { open: 300, close: 100 };

export type HoverCardProps = {
  /**
   * The element that opens the card. It must take a ref: an HTML element, or
   * a component with `React.forwardRef`. Put a component without a ref in a
   * `<span>`.
   */
  children: FloatingTrigger;
  /**
   * The content of the card: a preview, an image, a table, links. HoverCard
   * draws the surface. Put text in a `HoverCard.Body`
   * to get the inset. With no value, there is no card.
   */
  content: ReactNode;
  /**
   * The side of the trigger where the card opens. It moves to the other side
   * when there is no space.
   * @default "top"
   */
  placement?: Placement;
  /**
   * The space between the trigger and the card, in pixels.
   * @default { mainAxis: 16 }
   */
  offset?: OffsetOptions;
};

/**
 * Rich content about its trigger: a preview, an image, a table, links. It
 * opens on hover and on keyboard focus, and the pointer can move into it.
 * For a short text, use Tooltip.
 */
function HoverCard({
  children,
  content,
  placement = 'top',
  offset = { mainAxis: 16 },
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const enabled = Boolean(content);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen && enabled,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware(offset),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    // While the pointer moves from the trigger to the card, the card stays
    // open, also on a diagonal path.
    useHover(context, {
      enabled,
      delay: HOVER_CARD_DELAY,
      handleClose: safePolygon({ requireIntent: false, buffer: 5 }),
    }),
    useFocus(context, { enabled }),
    useDismiss(context, { enabled }),
  ]);

  return (
    <>
      {cloneTrigger(children, refs.setReference, getReferenceProps)}
      {isOpen && enabled && (
        <Portal>
          <NewZIndex>
            {(zIndex) => (
              <div
                ref={refs.setFloating}
                className="HoverCard"
                style={{ ...floatingStyles, zIndex }}
                {...getFloatingProps()}
              >
                {content}
              </div>
            )}
          </NewZIndex>
        </Portal>
      )}
    </>
  );
}

export type HoverCardBodyProps = {
  /**
   * The text of the card: one sentence (it can contain links), or block
   * elements (`p`, an `InfoList`) with a gap between them. A
   * `HoverCard.Note` can follow the text.
   */
  children: ReactNode;
};

/** The inset and the text style of a card with text */
function HoverCardBody({ children }: HoverCardBodyProps) {
  return <div className="HoverCard__body">{children}</div>;
}

export type HoverCardNoteProps = {
  /** A quiet line under the text, for example how a value is counted */
  children: ReactNode;
};

/** A quiet line at the end of a HoverCard.Body */
function HoverCardNote({ children }: HoverCardNoteProps) {
  return <p className="HoverCard__note">{children}</p>;
}

export default Object.assign(HoverCard, {
  Body: HoverCardBody,
  Note: HoverCardNote,
});
