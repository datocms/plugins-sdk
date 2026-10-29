import React from 'react';
import { GroupBase, GroupProps } from 'react-select';
import { Dropdown } from '../../actions/Dropdown';
import type { Message } from '../../Message';
import { BaseSelectOption } from './';

// A group of options is a group of the Dropdown menus: its title sticks at
// the top while the options scroll.
function SelectGroup<O extends BaseSelectOption, G extends GroupBase<O>>({
  label,
  children,
}: GroupProps<O, boolean, G>) {
  return (
    <Dropdown.MenuGroup title={label as Message}>{children}</Dropdown.MenuGroup>
  );
}

export default React.memo(SelectGroup) as typeof SelectGroup;
