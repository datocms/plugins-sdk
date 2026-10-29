import classNames from 'classnames';
import React from 'react';
import { GroupBase, OptionProps } from 'react-select';
import { Dropdown } from '../../actions/Dropdown';
import { BaseSelectOption } from './';

// react-select moves the focus through the options with its own keys. The
// button of the item must not take the focus with Tab.
const CONTENT_PROPS = { tabIndex: -1 };

// An option is an item of the Dropdown menus. The highlight of react-select
// is "selected". In a single selection, the chosen value is "active": the
// gutter at the left of the option shows a check.
function SelectOption<O extends BaseSelectOption, G extends GroupBase<O>>({
  children,
  innerRef,
  innerProps,
  isDisabled,
  isFocused,
  isSelected,
  isMulti,
}: OptionProps<O, boolean, G>) {
  return (
    <Dropdown.MenuItem
      {...(innerProps as React.HTMLAttributes<HTMLDivElement>)}
      ref={innerRef}
      aria-disabled={isDisabled}
      className={classNames('SelectInput__option', isDisabled && 'is-disabled')}
      selected={isFocused}
      active={isMulti ? undefined : isSelected}
      clickable
      contentProps={CONTENT_PROPS}
    >
      {children}
    </Dropdown.MenuItem>
  );
}

export default React.memo(SelectOption) as typeof SelectOption;
