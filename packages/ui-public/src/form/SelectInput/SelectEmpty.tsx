import React from 'react';
import { GroupBase, NoticeProps } from 'react-select';
import { Dropdown } from '../../actions/Dropdown';
import { BaseSelectOption } from './';

// The text of the menu when no option matches the search, or while the
// options load
function SelectEmpty<O extends BaseSelectOption, G extends GroupBase<O>>({
  children,
}: NoticeProps<O, boolean, G>) {
  return <Dropdown.MenuEmpty>{children}</Dropdown.MenuEmpty>;
}

export default React.memo(SelectEmpty) as typeof SelectEmpty;
