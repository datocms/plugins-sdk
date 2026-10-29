import classNames from 'classnames';
import React, { forwardRef, useRef, useState } from 'react';
import { Generic } from '../../icons/index';
import Button from '../actions/Button';
import { Dropdown } from '../actions/Dropdown';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import Link from '../navigation/Link';
import RawButton from '../semantic/RawButton';
import { SvgIcon } from '../utils/types';

/** A button on the media. It also fits in `options`, as a menu option. */
export type MediaCardAction = {
  /**
   * The key of the action. Give it when the label changes, for example
   * "Play" and "Pause". Thus the button keeps the keyboard focus.
   */
  id?: string;
  /** The text of the button or of the menu option. */
  label: Message;
  /**
   * An icon before the label, on the media. A menu does not show it,
   * because the other options of the menu have no icon.
   */
  icon?: SvgIcon;
  /** A disabled action is not shown in `actions`. A menu shows it grayed. */
  disabled?: boolean;
  /** Runs when the user picks the action. */
  onClick: (e: React.MouseEvent) => void;
  /** The action is destructive, for example a delete. It shows in red. */
  alert?: boolean;
};

type MediaCardOptionBase = {
  /** The text of the menu option. */
  label: Message;
  /** The option shows grayed and the user cannot pick it. */
  disabled?: boolean;
  /** The option is destructive, for example a delete. It shows in red. */
  alert?: boolean;
};

/** An option of the ⋮ menu. */
export type MediaCardOption = MediaCardOptionBase &
  (
    | {
        /** Runs when the user picks the option. */
        onClick: (e: React.MouseEvent) => void;
        submenu?: never;
        action?: never;
      }
    | {
        /**
         * The id of an action of the registry (`ui-public/Actions`). The option
         * runs it and shows its keys.
         */
        action: string;
        onClick?: never;
        submenu?: never;
      }
    | {
        /** The options of the submenu that the option opens. */
        submenu: React.ReactNode;
        onClick?: never;
        action?: never;
      }
  );

/** The text below the media, on one line with an ellipsis */
export type MediaCardCaption = {
  /** The text of the caption */
  text: Message;
  /**
   * The caption shows in the subtle ink, for example when the asset has no
   * title of its own.
   */
  muted?: boolean;
};

// React 17 has no `useId`, thus we make the ids of the captions with a counter.
let nextCaptionId = 0;

/** A click on the media opens a page of the app. */
type LinkCard = {
  /**
   * The page that the card opens. The media is a link, thus the user can
   * open the page in a new tab.
   */
  to: string;
  onClick?: never;
};

/** A click on the media runs `onClick`. */
type ClickCard = {
  /** Runs when the user clicks the media or the caption. */
  onClick: (e: React.MouseEvent) => void;
  to?: never;
};

/** The media has no action of its own. */
type StaticCard = {
  to?: never;
  onClick?: never;
};

type MediaCardBaseProps = {
  /**
   * The user can drag the card: it gets the move cursor and a hover border.
   * The drag logic is outside the card.
   */
  draggable?: boolean;
  /** The card is the one that the user drags: it fades. */
  dragging?: boolean;
  /**
   * A small card, for example in a gallery with many items. The actions on
   * the media are in a column.
   */
  compact?: boolean;
  /** The card is in a disabled field: it gets the surface of a disabled field. */
  disabled?: boolean;
  /** The text below the media, on one line with an ellipsis. */
  caption?: MediaCardCaption;
  /**
   * The options of the ⋮ menu at the top right of the card. For example
   * "Details", "Move to collection" (a submenu) and a red "Delete".
   */
  options?: MediaCardOption[];
  /**
   * The buttons on the media. They show when the pointer is on the card.
   * A touch screen shows them in the ⋮ menu. A disabled action is removed.
   */
  actions?: MediaCardAction[];
  /** The media: an image, a video preview or a player. */
  children?: React.ReactNode;
};

/** The user can select the card, for example for the actions on many assets. */
export type MediaCardSelection = {
  /** The card shows the selected border and the selected caption. */
  selected: boolean;
  /**
   * Runs when the user clicks the caption or the checkbox. Without `to` and
   * `onClick`, a click on the media runs it too. Without it, the card shows
   * the selection, but the user cannot change it.
   */
  onSelect?: () => void;
};

/** The caption has a checkbox, thus it has no `captionAction`. */
type CheckboxCaption = {
  selection: MediaCardSelection & {
    /**
     * The checkbox at the right of the caption. Its name is the caption.
     * "hover" shows it when the pointer is on the card, when the card has
     * the focus, when the card is selected and on a touch screen. "always"
     * shows it in all cases, for example when the user has selected a card.
     */
    checkbox: 'hover' | 'always';
  };
  captionAction?: never;
};

/** The caption has no checkbox. */
type PlainCaption = {
  selection?: MediaCardSelection & { checkbox?: never };
  /** An action at the right of the caption, for example the cross that cancels an upload. */
  captionAction?: React.ReactNode;
};

export type MediaCardProps = MediaCardBaseProps &
  (LinkCard | ClickCard | StaticCard) &
  (CheckboxCaption | PlainCaption);

// A device with no pointer gets the actions in a menu
const TOUCH_QUERY = '(hover: none)';
// On the server there is no device to test: the render shows the actions on
// the media, as for a pointer (the product scenes render on the server)
const SERVER_TOUCH = { matches: false, media: TOUCH_QUERY };

const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(function MediaCard(
  {
    draggable,
    dragging,
    compact,
    disabled,
    caption,
    captionAction,
    selection,
    options,
    actions,
    to,
    onClick,
    children,
  },
  ref,
) {
  const { tc } = useTranslation();
  const isTouchDevice = useMediaQuery(TOUCH_QUERY, SERVER_TOUCH).matches;
  const [captionId] = useState(() => `MediaCard__caption-${++nextCaptionId}`);
  const openRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const onSelect = selection?.onSelect;
  const handleOpen = onClick ?? onSelect;
  const handleOptionClick = (
    cb: (e: React.MouseEvent) => void,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    cb(e);
  };

  const renderOptions = () => {
    if (!options || options.length === 0) {
      return null;
    }

    return (
      <Dropdown
        className="MediaCard__menu"
        triggerComponent={Dropdown.IconTrigger}
        icon={Generic.ActionToggleIcon}
      >
        <Dropdown.Menu placement="bottom-end" contextualSearch={false}>
          {options.map((option, index) =>
            option.action !== undefined ? (
              <Dropdown.Option
                // biome-ignore lint/suspicious/noArrayIndexKey: an option has no id, and the menu renders the options again each time it opens
                key={index}
                alert={option.alert}
                disabled={option.disabled}
                action={option.action}
              >
                {tc(option.label)}
              </Dropdown.Option>
            ) : option.onClick ? (
              <Dropdown.Option
                // biome-ignore lint/suspicious/noArrayIndexKey: an option has no id, and the menu renders the options again each time it opens
                key={index}
                alert={option.alert}
                disabled={option.disabled}
                onPick={(e) => handleOptionClick(option.onClick, e)}
              >
                {tc(option.label)}
              </Dropdown.Option>
            ) : (
              <Dropdown.Submenu
                // biome-ignore lint/suspicious/noArrayIndexKey: an option has no id, and the menu renders the options again each time it opens
                key={index}
                triggerContent={tc(option.label)}
                disabled={option.disabled}
              >
                {option.submenu}
              </Dropdown.Submenu>
            ),
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderActions = () => {
    const actionsToRender = actions?.filter((action) => !action.disabled);

    if (!actionsToRender || actionsToRender.length === 0) {
      return null;
    }

    return isTouchDevice ? (
      <Dropdown
        className="MediaCard__menu"
        triggerComponent={Dropdown.IconTrigger}
        icon={Generic.ActionToggleIcon}
      >
        <Dropdown.Menu placement="bottom-end" contextualSearch={false}>
          {actionsToRender.map((action, index) => (
            <Dropdown.Option
              key={action.id ?? index}
              alert={action.alert}
              onPick={action.onClick}
            >
              {tc(action.label)}
            </Dropdown.Option>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <div className="MediaCard__actions">
        <div className="MediaCard__actions__inner">
          {actionsToRender.map((action, index) => (
            <Button
              key={action.id ?? index}
              tone={action.alert ? 'ghost-alert' : 'ghost'}
              size="small"
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>
    );
  };

  // The checkbox calls `onSelect` with its change. The click must not go to
  // the caption, because the caption calls `onSelect` too. The space around
  // the checkbox selects the card as the checkbox does. It is not a `label`,
  // because a `label` with no text is an error for WAVE.
  const handleCheckboxAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.target === e.currentTarget) {
      onSelect?.();
    }
  };

  const className = classNames('MediaCard', {
    'is-draggable': draggable,
    'is-selectable': onSelect,
    'is-compact': compact,
    'is-clickable': to || handleOpen,
    'is-selected': selection?.selected,
    'is-dragging': dragging,
    'is-disabled': disabled,
  });

  // A click on the caption selects the card. Without `onSelect`, it does
  // the same thing as a click on the media.
  const captionOnClick = onSelect
    ? onSelect
    : to || onClick
      ? () => openRef.current?.click()
      : undefined;

  // The link or the button covers the media. The other controls of the card
  // are next to it, not in it, because a control cannot contain a control.
  // It is not draggable, thus a drag of the card does not drag the link.
  const open =
    to !== undefined ? (
      <Link
        ref={openRef}
        className="MediaCard__open"
        to={to}
        aria-labelledby={captionId}
        draggable={false}
      />
    ) : handleOpen ? (
      <RawButton
        ref={openRef}
        className="MediaCard__open"
        ariaLabelledBy={captionId}
        onClick={handleOpen}
      />
    ) : null;

  return (
    <div className={className} ref={ref}>
      {options && options.length > 0 && renderOptions()}

      <div className="MediaCard__image-preview">
        {children}
        {open}
        {actions && renderActions()}
      </div>
      <div
        className={classNames('MediaCard__caption', {
          'is-disabled': caption?.muted,
        })}
        onClick={captionOnClick}
      >
        <span id={captionId} className="MediaCard__caption__text">
          {caption && tc(caption.text)}
        </span>
        {selection?.checkbox ? (
          <span
            className={classNames('MediaCard__checkbox', {
              'MediaCard__checkbox--always': selection.checkbox === 'always',
            })}
            onClick={handleCheckboxAreaClick}
          >
            <input
              type="checkbox"
              checked={selection.selected}
              disabled={!onSelect}
              aria-labelledby={captionId}
              onChange={() => onSelect?.()}
            />
          </span>
        ) : (
          captionAction && (
            <span className="MediaCard__caption__action">{captionAction}</span>
          )
        )}
      </div>
    </div>
  );
});

export default MediaCard;
