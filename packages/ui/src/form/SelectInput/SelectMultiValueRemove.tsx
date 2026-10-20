import React, { useContext } from 'react';
import { components, GroupBase, MultiValueRemoveProps } from 'react-select';
import { Generic } from '../../../icons/index';
import { BaseSelectOption } from './';
import Context from './Context';

// The removal of a value clears only a part of the value of the field, thus
// the cross is not red (see .SelectInput__multi-value-remove in
// _SelectInput.css). A disabled or read-only select has no cross.
function SelectMultiValueRemove<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>(props: MultiValueRemoveProps<O, true, G>) {
  const { disabled } = useContext(Context);

  if (disabled) {
    return null;
  }

  return (
    <components.MultiValueRemove<O, true, G> {...props}>
      <Generic.CloseIcon className="SelectInput__cross" aria-hidden="true" />
    </components.MultiValueRemove>
  );
}

export default React.memo(
  SelectMultiValueRemove,
) as typeof SelectMultiValueRemove;
