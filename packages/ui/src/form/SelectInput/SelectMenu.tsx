import classNames from 'classnames';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { components, GroupBase, MenuProps } from 'react-select';
import { Navigation } from '../../../icons/index';
import { Dropdown } from '../../actions/Dropdown';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';
import RawButton from '../../semantic/RawButton';
import { stopPropagation } from '../../utils/events';
import { BaseSelectOption } from './';

/**
 * The list that an action of the footer shows in the place of the options.
 * `SelectInput` holds it: the keys, the Tab key and the close of the menu
 * must know about it.
 */
export type SelectMenuList = { label: Message; content: ReactNode };

export const MenuListContext = createContext<{
  list: SelectMenuList | null;
  setList: (list: SelectMenuList | null) => void;
}>({ list: null, setList: () => {} });

// The menu is the panel of the Dropdown menus. The menu of react-select
// keeps the position under or above the control, and gets the classes of
// MenuContainer (see useSelectClassNames). "data-side" gives the direction
// of the enter animation.
function SelectMenu<O extends BaseSelectOption, G extends GroupBase<O>>(
  props: MenuProps<O, boolean, G>,
) {
  // SelectInput gives its props to the menu through react-select
  const { menuFooter } = props.selectProps as unknown as {
    menuFooter?: ReactNode;
  };
  const { list, setList } = useContext(MenuListContext);
  const { innerProps, placement } = props;

  const sideInnerProps = useMemo(
    () =>
      ({ ...innerProps, 'data-side': placement }) as MenuProps<
        O,
        boolean,
        G
      >['innerProps'],
    [innerProps, placement],
  );

  const footerClassName = classNames('SelectInput__menu-footer', {
    'SelectInput__menu-footer--alone': list,
    'SelectInput__menu-footer--multiple': props.isMulti,
  });

  // react-select closes the menu when the user touches the page out of the
  // control and of the list of options. The footer is not in the list, thus
  // the touch must not go up to the listener of react-select.
  return (
    <components.Menu<O, boolean, G> {...props} innerProps={sideInnerProps}>
      <Dropdown.MenuPanel className="SelectInput__panel">
        {list ? (
          <div className={footerClassName} onTouchEnd={stopPropagation}>
            <ActionButton
              back
              icon={<Navigation.ChevronLeftIcon />}
              label={list.label}
              onClick={() => setList(null)}
            />
            {list.content}
          </div>
        ) : (
          <>
            {props.children}
            {menuFooter && (
              <div className={footerClassName} onTouchEnd={stopPropagation}>
                {menuFooter}
              </div>
            )}
          </>
        )}
      </Dropdown.MenuPanel>
    </components.Menu>
  );
}

export default React.memo(SelectMenu) as typeof SelectMenu;

// The text input of the select has the focus while its menu is open (a
// press on the menu does not move the focus), and the select closes its
// menu when the input loses the focus.
export function closeSelectMenu() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export type SelectMenuActionProps = {
  /** The icon before the label. It starts where the content of an option starts. */
  icon?: ReactNode;
  /** The label of the action */
  label: Message;
} & (
  | {
      /**
       * Called when the user picks the action. Call `closeSelectMenu` first
       * when the action opens a modal, so the menu is not open below the
       * modal.
       */
      onPick: () => void;
      list?: never;
    }
  | {
      /**
       * The action opens this list of actions in the place of the options.
       * The select shows the label of the action as the title of the list,
       * which goes back to the options. Escape and the close of the menu go
       * back too.
       */
      list: ReactNode;
      onPick?: never;
    }
);

/** An action of the footer of the menu. It looks like an option. */
export const SelectMenuAction = React.memo(function SelectMenuAction({
  icon,
  label,
  onPick,
  list,
}: SelectMenuActionProps) {
  const { setList } = useContext(MenuListContext);
  const opensList = list !== undefined;

  return (
    <ActionButton
      icon={icon}
      label={label}
      opensList={opensList}
      onClick={opensList ? () => setList({ label, content: list }) : onPick}
    />
  );
});

type ActionButtonProps = {
  icon?: ReactNode;
  label: Message;
  opensList?: boolean;
  back?: boolean;
  onClick?: () => void;
};

// An action of the footer looks like an option of the menu: its icon starts
// where the content of an option starts.
function ActionButton({
  icon,
  label,
  opensList,
  back,
  onClick,
}: ActionButtonProps) {
  const { tc } = useTranslation();
  return (
    <RawButton
      className={classNames('SelectInput__menu-action', {
        'SelectInput__menu-action--back': back,
      })}
      onClick={onClick}
    >
      {icon && <span className="SelectInput__menu-action__icon">{icon}</span>}
      <span className="SelectInput__menu-action__label">{tc(label)}</span>
      {opensList && (
        <span className="SelectInput__menu-action__chevron">
          <Navigation.ChevronRightIcon />
        </span>
      )}
    </RawButton>
  );
}
