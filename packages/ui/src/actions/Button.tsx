import type { Placement } from '@floating-ui/react';
import classNames from 'classnames';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Spinner from '../feedback/Spinner';
import { useTranslation } from '../i18n';
import {
  isHtmlMessage,
  isIntlMessage,
  type Message,
  type TextMessage,
} from '../Message';
import Link from '../navigation/Link';
import type { FloatingTrigger } from '../overlays/floatingTrigger';
import Tooltip from '../overlays/Tooltip';
import RawButton from '../semantic/RawButton';
import { SvgIcon } from '../utils/types';
import { ActionTooltip } from './Actions/ActionTooltip';
import {
  type Disabled,
  DisabledReasonTooltip,
  disabledReasonOf,
} from './disabledReason';

/**
 * "overlay" and "on-primary" are for a colored bar (the navigation bar, a
 * floating bar): "overlay" has a light translucent fill, "on-primary" has a
 * white fill in all the themes, for the main action on a brand color.
 */
export type ButtonTone =
  | 'soft'
  | 'ghost'
  | 'primary'
  | 'alert'
  | 'ghost-alert'
  | 'overlay'
  | 'on-primary';

/**
 * "regular" is the plain ".button" class, without a size class. "field" has
 * the height of a field (see --control-height).
 */
export type ButtonSize =
  | 'micro'
  | 'milli'
  | 'small'
  | 'field'
  | 'regular'
  | 'large';

/**
 * The size of the buttons of the place, when a button does not give one:
 * "small" by default, "milli" in a toolbar (the toolbar is short: two
 * insets plus one line of the title, and a "small" button almost touches
 * its top and bottom edges), "field" in a toolbar of fields (a filter bar:
 * the buttons have the height of the fields near them).
 */
export const ButtonSizeContext = React.createContext<ButtonSize>('small');

export function useButtonSize(): ButtonSize {
  return useContext(ButtonSizeContext);
}

/** A label, with an optional icon before it */
type WithLabel = {
  /** The text of the button */
  label: Message;
  /** The icon before the label */
  icon?: SvgIcon;
  iconOnly?: false;
  /** Content after the label (for example a "PRO" pill) */
  trailing?: ReactNode;
  tooltip?: ActionTooltipOptions;
};

/**
 * The name and the keys of an action of the registry (`ui/Actions`), in
 * the tooltip. An icon-only button shows its label in place of the name.
 * When the action has no keys or does not exist, the tooltip has no keys:
 * an icon-only button shows its label, and a button with a label shows no
 * tooltip.
 */
export type ActionTooltipOptions = {
  /** The id of the action */
  action: string;
  /**
   * The tooltip goes below when there is no space above it.
   * @default "top"
   */
  placement?: Placement;
  content?: never;
  long?: never;
};

/** The tooltip of an icon-only button, with options */
type TooltipOptions =
  /** A text (the label by default). "long" is for a paragraph or a list. */
  | {
      content?: Message;
      long?: boolean;
      placement?: Placement;
      action?: never;
    }
  | ActionTooltipOptions;

function isTooltipOptions(
  tooltip: Message | TooltipOptions | undefined,
): tooltip is TooltipOptions {
  return (
    typeof tooltip === 'object' &&
    tooltip !== null &&
    !isIntlMessage(tooltip) &&
    !isHtmlMessage(tooltip) &&
    !React.isValidElement(tooltip)
  );
}

/**
 * Only the icon. The label is the accessible name of the button, and a
 * tooltip shows it.
 */
type IconOnly = {
  /** The accessible name of the button and the text of its tooltip */
  label: TextMessage;
  icon: SvgIcon;
  /** Shows only the icon */
  iconOnly: true;
  trailing?: never;
  /**
   * The text of the tooltip, when it is not the label (for example the
   * reason why the button is disabled), or the options of the tooltip
   */
  tooltip?: Message | TooltipOptions;
};

/**
 * When the handler returns a promise, the button is busy (a spinner,
 * disabled) until the promise settles.
 */
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => unknown;

/** The state of a button element. A link cannot show it. */
type ButtonElementState = {
  /**
   * The action runs: the button shows a spinner in the place of the icon
   * (before the label when there is no icon), and it is disabled. An
   * "onClick" that returns a promise sets it automatically.
   */
  busy?: boolean;
  /** The state of a toggle button (for example the filter toggle) */
  pressed?: boolean;
};

/** A link has no busy or pressed state */
type LinkElementState = {
  busy?: never;
  pressed?: never;
};

/** Runs "onClick" */
type ClickAction = ButtonElementState & {
  onClick: ClickHandler;
  to?: never;
  href?: never;
  submit?: never;
  newTab?: never;
};

/** A link to a page of the app */
type LinkAction = LinkElementState & {
  /** The page of the app: the path with its query, for example "/editor?tab=x" */
  to: string;
  /** Opens the page in a new tab (for example from a modal, to keep it open) */
  newTab?: boolean;
  onClick?: never;
  href?: never;
  submit?: never;
};

/** A link to a page out of the app */
type ExternalLinkAction = LinkElementState & {
  href: string;
  /** Opens the page in a new tab (for example the docs) */
  newTab?: boolean;
  onClick?: never;
  to?: never;
  submit?: never;
};

/**
 * Submits the form of the button. "onClick" is optional: it runs before
 * the submit.
 */
type SubmitAction = ButtonElementState & {
  submit: true;
  onClick?: ClickHandler;
  to?: never;
  href?: never;
  newTab?: never;
};

/** No action: the button only shows its tooltip, or it is disabled */
type NoAction = ButtonElementState & {
  onClick?: never;
  to?: never;
  href?: never;
  submit?: never;
  newTab?: never;
};

/** The handlers take an HTMLElement: the button can be a link */
type HtmlProps = Pick<
  React.HTMLAttributes<HTMLElement>,
  | 'id'
  | 'autoFocus'
  | 'tabIndex'
  | 'onMouseDown'
  | 'onKeyDown'
  | 'onFocus'
  | 'onBlur'
  | 'onMouseEnter'
  | 'onMouseLeave'
> &
  React.AriaAttributes;

/** What the button shows */
export type ButtonContent = WithLabel | IconOnly;

/** What the button does */
export type ButtonAction =
  | ClickAction
  | LinkAction
  | ExternalLinkAction
  | SubmitAction
  | NoAction;

export type ButtonProps = {
  /**
   * The look of the button. Toolbar.Button makes "ghost" the default.
   * @default "soft"
   */
  tone?: ButtonTone;
  /**
   * The size of the place by default: "milli" in a toolbar, "small" out of
   * a toolbar (see useButtonSize)
   */
  size?: ButtonSize;
  /** The button fills the width of its container */
  expand?: boolean;
  /** Give a reason when the user must know why the button is disabled */
  disabled?: Disabled;
  /** Only for the place of the button (margin, alignment), not for its look */
  className?: string;
} & HtmlProps &
  ButtonContent &
  ButtonAction;

const toneClassName: Record<ButtonTone, string> = {
  soft: 'button',
  ghost: 'button button--ghost',
  primary: 'button button--primary',
  alert: 'button button--alert',
  'ghost-alert': 'button button--ghost-alert',
  overlay: 'button button--rev',
  'on-primary': 'button button--on-primary',
};

const sizeClassName: Record<ButtonSize, string | null> = {
  micro: 'button--micro',
  milli: 'button--milli',
  small: 'button--small',
  field: 'button--field',
  regular: null,
  large: 'button--large',
};

/** The classes of the look of a button. Button and ButtonTrigger use them. */
export function buttonClassName({
  tone,
  size,
  iconOnly,
  expand,
}: {
  tone: ButtonTone;
  size: ButtonSize;
  iconOnly?: boolean;
  expand?: boolean;
}) {
  return classNames(toneClassName[tone], sizeClassName[size], {
    'button--icon-only': iconOnly,
    'button--expand': expand,
  });
}

/**
 * A button or a link with the look of a button. Use it for every button
 * with the ".button" classes, except the dropdown triggers (see
 * Dropdown/triggers), SplitButton and the buttons with their own look (the
 * navigation bar).
 *
 * A button with a label can be in a Tooltip: the button takes its ref and
 * its event props. A button with only the icon has its own tooltip: do not
 * put it in a Tooltip. For the name and the keys of an action, give
 * "tooltip={{ action: id }}".
 */
const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    tone = 'soft',
    size,
    expand,
    disabled,
    busy: outsideBusy,
    pressed,
    className,
    label,
    icon: Icon,
    iconOnly,
    trailing,
    tooltip,
    onClick,
    to,
    newTab,
    href,
    submit,
    ...rest
  },
  ref,
) {
  const placeSize = useButtonSize();
  const { tm, tc } = useTranslation();
  const iconOnlyLabel = iconOnly ? tm(label) : undefined;
  const isDisabled = Boolean(disabled);
  const disabledReason = disabledReasonOf(disabled);
  const [pending, setPending] = useState(false);
  const busy = outsideBusy || pending;

  // The effect sets the ref again, because StrictMode mounts the button a
  // second time after the cleanup.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleClick =
    onClick && !isDisabled
      ? (event: React.MouseEvent<HTMLButtonElement>) => {
          const result = onClick(event);

          if (result instanceof Promise) {
            setPending(true);
            result.finally(() => {
              if (mounted.current) {
                setPending(false);
              }
            });
          }
        }
      : undefined;

  const commonProps = {
    ...rest,
    className: classNames(
      buttonClassName({ tone, size: size ?? placeSize, iconOnly, expand }),
      className,
    ),
    'aria-label': iconOnlyLabel ?? rest['aria-label'],
    'aria-disabled':
      disabledReason !== undefined ? true : rest['aria-disabled'],
  };

  // The spinner of a busy button takes the place of the icon, thus a button
  // with an icon keeps its width. aria-busy tells the state, thus the
  // spinner is only a decoration.
  const leading = busy ? (
    <Spinner inline={true} label={false} />
  ) : (
    Icon && <Icon />
  );

  const content = iconOnly ? (
    leading
  ) : (
    <>
      {leading}
      <span>{tc(label)}</span>
      {trailing}
    </>
  );

  let element: FloatingTrigger;

  if ((to !== undefined || href !== undefined) && isDisabled) {
    // A link without href cannot navigate. It is focusable only with a
    // reason, thus the keyboard can open the tooltip.
    element = (
      <a
        {...commonProps}
        ref={ref as React.Ref<HTMLAnchorElement>}
        role="link"
        aria-disabled={true}
        tabIndex={disabledReason !== undefined ? 0 : undefined}
      >
        {content}
      </a>
    );
  } else if (to !== undefined) {
    element = (
      <Link
        {...commonProps}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        to={to}
        target={newTab ? '_blank' : undefined}
      >
        {content}
      </Link>
    );
  } else if (href !== undefined) {
    element = (
      <a
        {...commonProps}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  } else {
    element = (
      <RawButton
        {...commonProps}
        ref={ref as React.Ref<HTMLButtonElement>}
        // A button with a reason is not "disabled", thus it must not submit
        submit={submit && !isDisabled ? true : undefined}
        disabled={(isDisabled && disabledReason === undefined) || busy}
        pressed={pressed}
        aria-busy={busy || undefined}
        onClick={handleClick}
      >
        {content}
      </RawButton>
    );
  }

  if (disabledReason !== undefined) {
    return (
      <DisabledReasonTooltip
        disabled={disabled}
        placement={isTooltipOptions(tooltip) ? tooltip.placement : undefined}
      >
        {element}
      </DisabledReasonTooltip>
    );
  }

  if (isTooltipOptions(tooltip) && tooltip.action !== undefined) {
    return (
      <ActionTooltip
        action={tooltip.action}
        placement={tooltip.placement}
        label={iconOnlyLabel}
      >
        {element}
      </ActionTooltip>
    );
  }

  if (!iconOnly) {
    return element;
  }

  if (!isTooltipOptions(tooltip)) {
    return <Tooltip label={tooltip ?? iconOnlyLabel}>{element}</Tooltip>;
  }

  return (
    <Tooltip
      label={tooltip.content ?? iconOnlyLabel}
      long={tooltip.long}
      placement={tooltip.placement}
    >
      {element}
    </Tooltip>
  );
});

export default Button;
