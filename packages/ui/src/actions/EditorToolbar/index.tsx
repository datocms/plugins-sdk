import classNames from 'classnames';
import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from '../../i18n';
import { type Message, type TextMessage } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';
import NewZIndex from '../../overlays/NewZIndex';
import { SvgIcon } from '../../utils/types';
import { Dropdown } from '../Dropdown';
import DropdownContext from '../Dropdown/DropdownContext';
import { handleDropdownTriggerKeyDown } from '../Dropdown/triggers/handleDropdownTriggerKeyDown';
import { EditorToolbarButton, EditorToolbarTooltipPlacement } from './Button';
import { EditorToolbarButtons } from './Buttons';
import { EditorToolbarGroup } from './Group';

export type {
  EditorToolbarButtonProps,
  EditorToolbarTooltipPlacementProps,
} from './Button';
export type {
  EditorToolbarButtonKey,
  EditorToolbarButtonsProps,
  EditorToolbarCommand,
  EditorToolbarCommands,
} from './Buttons';
export {
  useEditorToolbarState,
  useEditorToolbarVisible,
  useEditorToolbarWiring,
} from './hooks';

export type EditorToolbarProps = {
  /**
   * Hides the toolbar. Give the negation of `visible` of
   * `useEditorToolbarWiring`, or the negation of the value of
   * `useEditorToolbarVisible`.
   * @default false
   */
  hidden?: boolean;
  /** The groups of the toolbar: `EditorToolbar.Group` or `EditorToolbar.Buttons`. */
  children: ReactNode;
  /**
   * The accessible name of the toolbar.
   * @default "Text formatting"
   */
  ariaLabel?: TextMessage;
};

// The controls of the toolbar. The toolbar has one Tab stop: only the last
// control with the focus (at first, the first control) has tabindex 0.
const ITEM_SELECTOR =
  '.EditorToolbar__button, .EditorToolbar__dropdown__current';

function useRovingFocus() {
  const innerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLElement | null>(null);

  const items = () =>
    Array.from(
      innerRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [],
    );

  const sync = () => {
    const all = items();
    const current =
      currentRef.current && all.includes(currentRef.current)
        ? currentRef.current
        : all[0];
    for (const item of all) {
      item.tabIndex = item === current ? 0 : -1;
    }
  };

  // The controls change with the cursor and the settings of the field
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) {
      return undefined;
    }
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(inner, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const onFocus = (event: React.FocusEvent) => {
    const item = event.target as HTMLElement;
    if (innerRef.current?.contains(item) && item.matches(ITEM_SELECTOR)) {
      currentRef.current = item;
      sync();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const all = items();
    const index = all.indexOf(event.target as HTMLElement);
    // The menus are in a portal: React sends their keys here too
    if (index === -1) {
      return;
    }
    const next = {
      ArrowRight: all[(index + 1) % all.length],
      ArrowLeft: all[(index - 1 + all.length) % all.length],
      Home: all[0],
      End: all[all.length - 1],
    }[event.key];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return { innerRef, onFocus, onKeyDown };
}

// Stops the default action of the pointer, thus the focus and the selection
// stay in the editor
function preventFocusLoss(event: React.MouseEvent) {
  event.preventDefault();
}

// Keeps the focus in the editor on a press in the toolbar or in its menus
// (React sends the events of the portal of a menu here too). A text field,
// such as the search of a menu, takes the focus as usual.
function keepEditorFocus(event: React.MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('input, textarea, [contenteditable="true"]')) {
    event.preventDefault();
  }
}

function EditorToolbarRoot({
  hidden = false,
  children,
  ariaLabel = { id: 'editorToolbar.label' },
}: EditorToolbarProps) {
  const { tm } = useTranslation();
  const { innerRef, onFocus, onKeyDown } = useRovingFocus();
  // The editor loses the focus when the user moves to the toolbar with the
  // keyboard. The toolbar stays while the focus is in it or in its menus.
  // The menus are in a portal, thus a blur waits for a focus that comes
  // next, from the toolbar or from a menu.
  const [hasFocus, setHasFocus] = useState(false);
  const blurTimeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(blurTimeout.current), []);

  return (
    <NewZIndex>
      {(zIndex) => (
        <div
          className={classNames('EditorToolbar', {
            'is-visible': !hidden || hasFocus,
          })}
          style={{ zIndex }}
          onMouseDown={keepEditorFocus}
          onFocus={(event) => {
            window.clearTimeout(blurTimeout.current);
            setHasFocus(true);
            onFocus(event);
          }}
          onBlur={() => {
            blurTimeout.current = window.setTimeout(() => setHasFocus(false));
          }}
        >
          <div
            ref={innerRef}
            role="toolbar"
            aria-label={tm(ariaLabel)}
            className="EditorToolbar__inner"
            onKeyDown={onKeyDown}
          >
            {children}
          </div>
        </div>
      )}
    </NewZIndex>
  );
}

type TriggerProps = {
  onTrigger: (event: React.SyntheticEvent) => void;
  open: boolean;
  icon?: SvgIcon;
  label: Message;
  muted?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean) => void;
};

function EditorToolbarDropdownTrigger({
  onTrigger,
  open,
  icon: Icon,
  label,
  muted,
  disabled,
  onToggle,
}: TriggerProps) {
  const { tc } = useTranslation();
  const { triggerId, menuId } = useContext(DropdownContext);

  useEffect(() => {
    onToggle?.(open);
  }, [open, onToggle]);

  return (
    <div
      id={triggerId}
      role="button"
      // EditorToolbar sets the Tab stop of the toolbar
      tabIndex={-1}
      className={classNames('EditorToolbar__dropdown__current', {
        'EditorToolbar__dropdown__current--disabled': disabled,
      })}
      onMouseDown={disabled ? preventFocusLoss : onTrigger}
      onKeyDown={(event) => {
        if (!disabled) {
          handleDropdownTriggerKeyDown(event, onTrigger, open);
        }
      }}
      aria-disabled={disabled || undefined}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={menuId}
    >
      {Icon && <Icon />}
      <span
        className={classNames('EditorToolbar__dropdown__current__label', {
          'EditorToolbar__dropdown__current__label--muted': muted,
        })}
      >
        {tc(label)}
      </span>
      <MenuChevron />
    </div>
  );
}

export type EditorToolbarDropdownProps = {
  /** The icon before the label, for example the icon of the current block style. */
  icon?: SvgIcon;
  /**
   * The text of the trigger: the current value ("Paragraph") or the name of
   * the menu ("Insert"). A long text ends with "…".
   */
  label: Message;
  /**
   * Shows the label in a subtle ink: the value is mixed ("Multiple
   * styles") or not valid.
   * @default false
   */
  muted?: boolean;
  /**
   * Makes the trigger wider, for a label that is a value ("Paragraph"):
   * 150px, not 120px.
   * @default false
   */
  wide?: boolean;
  /**
   * Stops the user from opening the menu.
   * @default false
   */
  disabled?: boolean;
  /**
   * Runs with the new state: `true` when the menu opens, `false` when it
   * closes. Use it to keep the toolbar visible while the menu is open.
   */
  onToggle?: (open: boolean) => void;
  /** The `Dropdown.Menu` that opens under the trigger. */
  children: ReactElement;
};

function EditorToolbarDropdown({
  icon,
  label,
  muted,
  wide = false,
  disabled,
  onToggle,
  children,
}: EditorToolbarDropdownProps) {
  return (
    <Dropdown
      className={classNames(
        'EditorToolbar__dropdown',
        wide && 'EditorToolbar__dropdown--wide',
      )}
      triggerComponent={EditorToolbarDropdownTrigger}
      icon={icon}
      label={label}
      muted={muted}
      disabled={disabled}
      onToggle={onToggle}
    >
      {children}
    </Dropdown>
  );
}

export const EditorToolbar = Object.assign(EditorToolbarRoot, {
  Button: EditorToolbarButton,
  Buttons: EditorToolbarButtons,
  Group: EditorToolbarGroup,
  Dropdown: EditorToolbarDropdown,
  TooltipPlacement: EditorToolbarTooltipPlacement,
});
