import {
  autoUpdate,
  NextFloatingDelayGroup,
  type OffsetOptions,
  type Placement,
  type Side,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useNextDelayGroup,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { Shortcut } from '../actions/Actions/Shortcut';
import {
  type ActionShortcut,
  parseShortcut,
} from '../actions/Actions/shortcuts';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import { cloneTrigger, type FloatingTrigger } from './floatingTrigger';
import NewZIndex from './NewZIndex';
import { floatingMiddleware } from './Popover';
import Portal from './Portal';

// The pointer must stay on a trigger for this time before the tooltip opens.
// In a TooltipDelayGroup, the next tooltip opens immediately after a tooltip
// closes, until the pointer is out of the triggers for TOOLTIP_GROUP_TIMEOUT.
const TOOLTIP_DELAY = { open: 450, close: 0 };
const TOOLTIP_GROUP_TIMEOUT = 300;

// The tooltip stays in the DOM for this time after it closes, while it fades
// out. Keep it equal to the transition of .Tooltip--closing.
const TOOLTIP_FADE_OUT_MS = 200;

// The tooltip shrinks toward the trigger when it closes.
const TRANSFORM_ORIGIN: Record<Side, string> = {
  top: '50% 100%',
  bottom: '50% 0',
  left: '100% 50%',
  right: '0 50%',
};

export type TooltipProps = {
  /**
   * The element that opens the tooltip. It must take a ref: an HTML element,
   * or a component with `React.forwardRef`. Put a component without a ref in
   * a `<span>`.
   */
  children: FloatingTrigger;
  /**
   * The text of the tooltip: a string, `{ id }` for a translation, `{ html }`
   * or a React element. With no value, there is no tooltip: write
   * `label={condition && text}` for a tooltip that shows only in some cases.
   */
  label: Message | false | null | undefined;
  /**
   * The keys of a keyboard shortcut, shown after the label: the keys of an
   * action (`{ key: 's', mod: true }`), or a string in the format of
   * `is-hotkey` ("mod+s"), as the text editors give them. "mod" is Cmd on a
   * Mac and Ctrl on other systems.
   */
  shortcut?: string | ActionShortcut | ActionShortcut[];
  /**
   * Use it for a paragraph or a list: the text is aligned at the start and
   * the tooltip is wider.
   * @default false
   */
  long?: boolean;
  /**
   * The side of the trigger where the tooltip opens. It moves to the other
   * side when there is no space.
   * @default "top"
   */
  placement?: Placement;
  /**
   * The space between the trigger and the tooltip, in pixels. Use it to move
   * the tooltip away from a large trigger, for example a bar of a chart.
   * @default { mainAxis: 16 }
   */
  offset?: OffsetOptions;
};

/**
 * A small dark label about its trigger. It opens on hover and on keyboard
 * focus, and Escape closes it. It has no interactive content: for content
 * with links, controls or images, use HoverCard.
 */
function Tooltip({
  children,
  label,
  shortcut,
  long,
  placement = 'top',
  offset = { mainAxis: 16 },
}: TooltipProps) {
  const { tc } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const enabled = Boolean(label);
  const keys =
    typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut;

  const {
    refs,
    floatingStyles,
    context,
    placement: finalPlacement,
  } = useFloating({
    open: isOpen && enabled,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    // The position goes in top and left. With a translate in transform, the
    // scale of .Tooltip--closing also scales the translate and moves the box.
    transform: false,
    middleware: floatingMiddleware(offset),
  });

  const { delayRef, hasProvider, isInstantPhase } = useNextDelayGroup(context, {
    enabled,
  });

  // When the next tooltip of the group opens, this tooltip closes with no
  // fade. Two tooltips do not show at the same time.
  const { isMounted, status } = useTransitionStatus(context, {
    duration: { open: 0, close: isInstantPhase ? 0 : TOOLTIP_FADE_OUT_MS },
  });

  // The accessible name of the trigger can already be the label (an icon
  // button with the same aria-label). Then the description adds nothing.
  const triggerProps = React.Children.only(children).props;
  const labelIsAccessibleName =
    typeof label === 'string' && triggerProps['aria-label'] === label;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled,
      delay: () => (hasProvider ? delayRef.current : TOOLTIP_DELAY),
    }),
    useFocus(context, { enabled }),
    useDismiss(context, { enabled }),
    useRole(context, {
      enabled: enabled && !labelIsAccessibleName,
      role: 'tooltip',
    }),
  ]);

  return (
    <>
      {cloneTrigger(children, refs.setReference, getReferenceProps)}
      {isMounted && enabled && (
        <Portal>
          <NewZIndex>
            {(zIndex) => (
              <div
                ref={refs.setFloating}
                className={classNames('Tooltip', {
                  'Tooltip--long': long,
                  'Tooltip--with-shortcut': keys !== undefined,
                  'Tooltip--closing': status === 'close',
                })}
                style={{
                  ...floatingStyles,
                  zIndex,
                  transformOrigin:
                    TRANSFORM_ORIGIN[finalPlacement.split('-')[0] as Side],
                }}
                {...getFloatingProps()}
              >
                {keys ? (
                  <>
                    <span className="Tooltip__label">
                      {tc(label as Message)}
                    </span>
                    <Shortcut keys={keys} />
                  </>
                ) : (
                  tc(label as Message)
                )}
              </div>
            )}
          </NewZIndex>
        </Portal>
      )}
    </>
  );
}

/**
 * The tooltips in this group share one delay: after the first tooltip
 * opens, the next tooltip opens immediately. Put it once around the app.
 */
export function TooltipDelayGroup({ children }: { children: ReactNode }) {
  return (
    <NextFloatingDelayGroup
      delay={TOOLTIP_DELAY}
      timeoutMs={TOOLTIP_GROUP_TIMEOUT}
    >
      {children}
    </NextFloatingDelayGroup>
  );
}

export default Tooltip;
