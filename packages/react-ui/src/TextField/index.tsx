import React, { ReactNode } from 'react';
import { FieldWrapper, FormLabelProps, TextInput, TextInputProps } from '..';

type TextFieldProps = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: TextInputProps['value'];
  onChange: TextInputProps['onChange'];
  textInputProps?: TextInputProps;
};

export function TextField({
  id,
  name,
  label,
  hint,
  error,
  required,
  placeholder,
  formLabelProps,
  value,
  onChange,
  textInputProps,
}: TextFieldProps): JSX.Element {
  return (
    <FieldWrapper
      formLabelProps={formLabelProps}
      id={id}
      required={required}
      error={error}
      hint={hint}
      label={label}
    >
      <TextInput
        {...textInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        error={!!error}
      />
    </FieldWrapper>
  );
}
