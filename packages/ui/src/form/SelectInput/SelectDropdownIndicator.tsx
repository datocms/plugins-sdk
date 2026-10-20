import React from 'react';
import { components, DropdownIndicatorProps, GroupBase } from 'react-select';
import { MenuChevron } from '../../navigation/Chevron';
import { BaseSelectOption } from './';

// The chevron of react-select has another shape, size and color. The
// MenuChevron of the Dropdown triggers (ui/Dropdown/triggers)
// takes its place, thus a select looks the same as a menu trigger.
function SelectDropdownIndicator<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>(props: DropdownIndicatorProps<O, boolean, G>) {
  return (
    <components.DropdownIndicator<O, boolean, G> {...props}>
      <MenuChevron />
    </components.DropdownIndicator>
  );
}

export default React.memo(
  SelectDropdownIndicator,
) as typeof SelectDropdownIndicator;
