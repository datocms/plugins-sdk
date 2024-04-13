import React, { type ReactNode } from 'react';
import { FieldError, FieldHint, FormLabel, type FormLabelProps } from '..';

type FieldWrapperProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  children: ReactNode;
};

export function FieldWrapper({
  id,
  label,
  hint,
  error,
  required,
  formLabelProps,
  children,
}: FieldWrapperProps): JSX.Element {
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
      {children}
      {error && <FieldError>{error}</FieldError>}
      {hint && <FieldHint>{hint}</FieldHint>}
    </>
  );
}
