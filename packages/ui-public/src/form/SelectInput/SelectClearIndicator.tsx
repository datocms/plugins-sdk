import React from 'react';
import { ClearIndicatorProps, components, GroupBase } from 'react-select';
import { Generic } from '../../../icons/index';
import { BaseSelectOption } from './';

// The cross of the app, in the place of the cross of react-select. The
// button has the size of the chevron next to it, and the colors of the other
// clear buttons (see .SelectInput__clear in _SelectInput.css).
function SelectClearIndicator<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>(props: ClearIndicatorProps<O, boolean, G>) {
  return (
    <components.ClearIndicator<O, boolean, G> {...props}>
      <Generic.CloseIcon className="SelectInput__cross" aria-hidden="true" />
    </components.ClearIndicator>
  );
}

export default React.memo(SelectClearIndicator) as typeof SelectClearIndicator;
