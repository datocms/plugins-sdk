import React, { ReactNode } from 'react';
import {
  FieldError,
  FieldHint,
  FormLabel,
  FormLabelProps,
  SwitchInput,
  SwitchInputProps,
} from '..';
import cn from 'classnames';
import s from './styles.module.css.json';

type SwitchFieldProps = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: SwitchInputProps['value'];
  onChange: SwitchInputProps['onChange'];
  switchInputProps?: SwitchInputProps;
};

export function SwitchField({
  id,
  name,
  label,
  hint,
  error,
  required,
  formLabelProps,
  value,
  onChange,
  switchInputProps,
}: SwitchFieldProps): JSX.Element {
  return (
    <>
      <div className={s.switchField__flex}>
        <div className={s.switchField__switchInput}>
          <SwitchInput
            {...switchInputProps}
            name={name}
            value={value}
            onChange={onChange}
          />
        </div>
        <FormLabel
          {...formLabelProps}
          htmlFor={id}
          required={required}
          className={cn(s.switchField__label, formLabelProps?.className)}
        >
          {label}
        </FormLabel>
      </div>
      {(hint || error) && (
        <div className={s.switchField__below}>
          {hint && <FieldHint>{hint}</FieldHint>}
          {error && <FieldError>{error}</FieldError>}
        </div>
      )}
    </>
  );
}
