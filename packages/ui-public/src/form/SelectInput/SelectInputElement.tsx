import React from 'react';
import { components, GroupBase, InputProps } from 'react-select';
import { BaseSelectOption } from './';

// The ARIA props of the field that react-select does not give to its text
// input. SelectInput gives them through the props of the select.
type FieldAriaProps = {
  'aria-describedby'?: string;
  'aria-required'?: boolean;
};

// The text input of the select is the control of the field: it gets the
// description (the hint and the error) and the required state of the field.
// We do not give "required" to react-select, because it then adds a hidden
// required input, and the browser can stop the submit of the form.
function SelectInputElement<O extends BaseSelectOption, G extends GroupBase<O>>(
  props: InputProps<O, boolean, G>,
) {
  const { 'aria-describedby': describedBy, 'aria-required': required } =
    props.selectProps as unknown as FieldAriaProps;

  return (
    <components.Input<O, boolean, G>
      {...props}
      {...({
        'aria-describedby': describedBy,
        'aria-required': required,
      } as object)}
    />
  );
}

export default React.memo(SelectInputElement) as typeof SelectInputElement;
