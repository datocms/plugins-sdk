import React, { useContext } from 'react';
import { components, GroupBase, MultiValueRemoveProps } from 'react-select';
import { Generic } from '../../../icons/index';
import { useTranslation } from '../../i18n';
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
  const { tm } = useTranslation();

  if (disabled) {
    return null;
  }

  // react-select builds the name with the content of the chip, which can be
  // an element: "Remove [object Object]"
  const innerProps = {
    ...props.innerProps,
    'aria-label': tm({ id: 'a11y.selectInput.remove' }),
  };

  return (
    <components.MultiValueRemove<O, true, G> {...props} innerProps={innerProps}>
      <Generic.CloseIcon className="SelectInput__cross" aria-hidden="true" />
    </components.MultiValueRemove>
  );
}

export default React.memo(
  SelectMultiValueRemove,
) as typeof SelectMultiValueRemove;
