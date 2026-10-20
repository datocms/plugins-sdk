import classNames from 'classnames';
import React, { ReactNode, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Generic } from '../../icons/index';
import { useIsSmallViewport } from '../hooks/useMediaQuery';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import { MenuChevron } from '../navigation/Chevron';
import NewZIndex from '../overlays/NewZIndex';
import Portal from '../overlays/Portal';
import Button, { type ButtonTone, buttonClassName } from './Button';
import { Dropdown } from './Dropdown';
import DropdownTriggerButton from './Dropdown/triggers/DropdownTriggerButton';
import { type Disabled } from './disabledReason';

/** What a click on the button does */
type ActionBehavior =
  /** Runs a function */
  | {
      /**
       * Runs on a click. When it returns a promise, the button shows a
       * spinner until the promise ends.
       */
      onClick: (() => void) | (() => Promise<void>);
      menu?: never;
    }
  /** Opens a menu */
  | {
      /**
       * A `Dropdown.Menu` that the click opens. For example, the menu of the
       * collections where the selected assets can go.
       */
      menu: ReactNode;
      onClick?: never;
    };

export type Action = ActionBehavior & {
  /** A name that stays the same between renders. It is the React key. */
  id: string;
  /** The text of the button. */
  label: Message;
  /**
   * `primary` is a button on the brand color for the main actions on the
   * selection. `plain` is for the actions that change the selection itself
   * ("Select all", "Invert"). On a small viewport, the plain actions with
   * onClick go in one menu (⋮).
   * @default "plain"
   */
  tone?: 'primary' | 'plain';
  /**
   * Fades the button and stops the click. Give a reason when the user must
   * know why.
   */
  disabled?: Disabled;
};

const MenuActionTrigger = ({
  buttonClassName,
  disabled,
  label,
  open,
  onTrigger,
}: {
  buttonClassName: string;
  disabled?: Disabled;
  label: Message;
  open: boolean;
  onTrigger: (event: React.SyntheticEvent) => void;
}) => {
  const { tc } = useTranslation();
  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className={buttonClassName}
      disabled={disabled}
    >
      {/* The span makes the chevron a last child of its own: it then gets
          the margin of _button.css */}
      <span>{tc(label)}</span>
      <MenuChevron />
    </DropdownTriggerButton>
  );
};

export type MaybeAction = Action | false | null | undefined;

export type MultipleSelectionActionBarProps = {
  /**
   * Shows the bar: give it while the selection is not empty. The bar slides
   * in when it opens and out when it closes.
   */
  open: boolean;
  /** Tells how much is selected. For example "3 records selected". */
  status: Message;
  /** Runs when the user clicks the cross at the end of the bar. */
  onDeselectAll: () => void;
  /**
   * The buttons of the bar. An array in the list gives a group of buttons
   * that touch each other. A value that is `false`, `null` or `undefined`
   * shows nothing: use `condition && action`.
   */
  actions: (MaybeAction | MaybeAction[])[];
  /**
   * Where the bar floats. "pane": at the bottom of a Pane, above its footer
   * (give the bar to the slideUpToolbar prop of the Pane). "window": at the
   * bottom of the window, for a page with no Pane slot (the blocks of a
   * field in a record form).
   * @default "pane"
   */
  placement?: 'pane' | 'window';
  /**
   * More content after the actions. For example the actions that plugins
   * add.
   */
  extra?: ReactNode;
};

export default function MultipleSelectionActionBar({
  open,
  status,
  onDeselectAll,
  actions,
  extra,
  placement = 'pane',
}: MultipleSelectionActionBarProps) {
  const { tc } = useTranslation();
  const nodeRef = useRef<HTMLDivElement>(null);
  const smallViewport = useIsSmallViewport();

  // On a small viewport, the plain actions with onClick ("Select all",
  // "Invert") go in one menu, thus the bar stays on one line and the user
  // can still use them
  const goesInMenu = (action: MaybeAction): action is Action =>
    smallViewport && !!action && action.tone !== 'primary' && !!action.onClick;
  const menuActions = actions.flat().filter(goesInMenu);
  const barActions = actions
    .map((actionOrGroup) =>
      Array.isArray(actionOrGroup)
        ? actionOrGroup.filter((action) => !goesInMenu(action))
        : goesInMenu(actionOrGroup)
          ? null
          : actionOrGroup,
    )
    .filter((actionOrGroup) =>
      Array.isArray(actionOrGroup) ? actionOrGroup.some(Boolean) : true,
    );

  const renderAction = (action: MaybeAction) => {
    if (!action) {
      return null;
    }

    const tone: ButtonTone =
      action.tone === 'primary' ? 'on-primary' : 'overlay';

    if (action.onClick) {
      return (
        <Button
          key={action.id}
          tone={tone}
          size="micro"
          label={action.label}
          disabled={action.disabled}
          onClick={action.onClick}
        />
      );
    }

    return (
      <Dropdown
        key={action.id}
        triggerComponent={MenuActionTrigger}
        buttonClassName={buttonClassName({ tone, size: 'micro' })}
        disabled={action.disabled}
        label={action.label}
      >
        {() => <>{action.menu}</>}
      </Dropdown>
    );
  };

  const bar = (
    <NewZIndex>
      {(zIndex) => (
        <TransitionGroup>
          {open && (
            <CSSTransition
              key="overlay"
              timeout={200}
              classNames="show"
              nodeRef={nodeRef}
            >
              <div
                className={classNames(
                  'FloatingBar MultipleSelectionActionBar',
                  `MultipleSelectionActionBar--${placement}`,
                )}
                style={{ zIndex }}
                ref={nodeRef}
              >
                <div className="FloatingBar__text">{tc(status)}</div>
                <div className="FloatingBar__divider" />
                <div className="MultipleSelectionActionBar__actions">
                  {menuActions.length > 0 && (
                    <Dropdown
                      triggerComponent={Dropdown.IconTrigger}
                      icon={Generic.ActionToggleIcon}
                      label={{
                        id: 'MultipleSelectionActionBar.changeSelection',
                      }}
                    >
                      <Dropdown.Menu
                        placement="top-start"
                        contextualSearch={false}
                      >
                        {menuActions.map((action) => (
                          <Dropdown.Option
                            key={action.id}
                            onPick={action.onClick}
                            disabled={action.disabled}
                          >
                            {tc(action.label)}
                          </Dropdown.Option>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {barActions.map((actionOrGroup, index) =>
                    Array.isArray(actionOrGroup) ? (
                      <div
                        className="MultipleSelectionActionBar__button-group"
                        // biome-ignore lint/suspicious/noArrayIndexKey: questo è.
                        key={index}
                      >
                        {actionOrGroup.map(renderAction)}
                      </div>
                    ) : actionOrGroup ? (
                      renderAction(actionOrGroup)
                    ) : null,
                  )}
                  {extra}
                </div>
                <Button
                  tone="ghost"
                  size="micro"
                  iconOnly
                  icon={Generic.CloseIcon}
                  label={{ id: 'MultipleSelectionActionBar.deselectAll' }}
                  onClick={onDeselectAll}
                />
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </NewZIndex>
  );

  return placement === 'window' ? <Portal>{bar}</Portal> : bar;
}
