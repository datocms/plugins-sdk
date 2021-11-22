import React, { ReactNode } from 'react';
import {
  FieldError,
  FieldHint,
  FormLabel,
  FormLabelProps,
  TextInput,
  TextInputProps,
} from '..';

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
    <>
      <FormLabel
        {...formLabelProps}
        htmlFor={id}
        required={required}
        error={!!error}
      >
        {label}
      </FormLabel>

      <TextInput
        {...textInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        error={!!error}
      />

      {hint && <FieldHint>{hint}</FieldHint>}
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}
