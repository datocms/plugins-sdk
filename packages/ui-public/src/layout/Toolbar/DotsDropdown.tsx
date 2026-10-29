import React, { ReactNode, useContext } from 'react';
import { Generic } from '../../../icons/index';
import { Dropdown } from '../../actions/Dropdown';
import { type TextMessage } from '../../Message';
import { ToolbarMenuProviderContext } from './context';

export type DotsDropdownProps = {
  /** The Dropdown.Option elements of the menu */
  children: ReactNode;
  /** The menu does not show (give it when no option applies) */
  hidden?: boolean;
  /**
   * The name of the button and the text of its tooltip. Name the thing that
   * the menu acts on, for example "Actions for Hello world".
   * @default "Actions"
   */
  label?: TextMessage;
};

/**
 * The "⋮" menu of the actions on the thing that the toolbar shows. Put it
 * right after the title (and the subtitle), never at the right end.
 */
function DotsDropdown({ children, hidden, label }: DotsDropdownProps) {
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
          label={label}
        >
          {() => <Dropdown.Menu>{children}</Dropdown.Menu>}
        </Dropdown>
      </MenuProvider>
    </div>
  );
}

export default DotsDropdown;
