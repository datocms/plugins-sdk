import React, { type ReactNode } from 'react';
import {
  FieldWrapper,
  type FormLabelProps,
  TextareaInput,
  type TextareaInputProps,
} from '..';

type TextareaFieldProps = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: TextareaInputProps['value'];
  onChange: TextareaInputProps['onChange'];
  textareaInputProps?: TextareaInputProps;
};

export function TextareaField({
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
  textareaInputProps,
}: TextareaFieldProps): JSX.Element {
  return (
    <FieldWrapper
      formLabelProps={formLabelProps}
      id={id}
      required={required}
      error={error}
      hint={hint}
      label={label}
    >
      <TextareaInput
        {...textareaInputProps}
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
