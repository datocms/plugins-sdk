import React, { ReactNode, useContext } from 'react';
import { Dropdown } from '../../actions/Dropdown';
import { type TextMessage } from '../../Message';
import { ToolbarMenuProviderContext } from './context';

export type TextualDropdownProps = {
  /** The Dropdown.Option elements of the menu */
  children: ReactNode;
  /** The menu does not show */
  hidden?: boolean;
  /** The text of the trigger: the current value */
  text: TextMessage;
};

/** A subtitle that opens a menu to change its value */
function TextualDropdown({ children, hidden, text }: TextualDropdownProps) {
  const MenuProvider = useContext(ToolbarMenuProviderContext);

  if (hidden) {
    return null;
  }

  return (
    <div className="Toolbar__subtitle Toolbar__subtitle--dropdown">
      <MenuProvider>
        <Dropdown label={text} triggerComponent={Dropdown.TextualTrigger}>
          {() => <Dropdown.Menu>{children}</Dropdown.Menu>}
        </Dropdown>
      </MenuProvider>
    </div>
  );
}

export default TextualDropdown;
