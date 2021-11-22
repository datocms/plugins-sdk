import React, { ReactNode } from 'react';
import {
  FieldError,
  FieldHint,
  FormLabel,
  FormLabelProps,
  TextInput,
  TextInputProps,
} from '..';
import cn from 'classnames';
import s from './styles.module.css.json';

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
      <FormLabel {...formLabelProps} htmlFor={id} required={required}>
        {label}
      </FormLabel>

      <TextInput
        {...textInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />

      {hint && <FieldHint>{hint}</FieldHint>}
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}
