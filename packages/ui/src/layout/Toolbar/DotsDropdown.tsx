import React, { ReactNode, useContext } from 'react';
import { Generic } from '../../../icons/index';
import { Dropdown } from '../../actions/Dropdown';
import { ToolbarMenuProviderContext } from './context';

export type DotsDropdownProps = {
  /** The Dropdown.Option elements of the menu */
  children: ReactNode;
  /** The menu does not show (give it when no option applies) */
  hidden?: boolean;
};

/**
 * The "⋮" menu of the actions on the thing that the toolbar shows. Put it
 * right after the title (and the subtitle), never at the right end.
 */
function DotsDropdown({ children, hidden }: DotsDropdownProps) {
  const MenuProvider = useContext(ToolbarMenuProviderContext);

  if (hidden) {
    return null;
  }

  return (
    <div className="Toolbar__iconTrigger">
      <MenuProvider>
        <Dropdown
          triggerComponent={Dropdown.IconTrigger}
          icon={Generic.ActionToggleIcon}
        >
          {() => <Dropdown.Menu>{children}</Dropdown.Menu>}
        </Dropdown>
      </MenuProvider>
    </div>
  );
}

export default DotsDropdown;
