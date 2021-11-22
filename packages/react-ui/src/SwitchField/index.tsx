import React, { ReactNode } from 'react';
import {
  FieldError,
  FieldHint,
  FormLabel,
  FormLabelProps,
  SwitchInput,
  SwitchInputProps,
} from '..';
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
  switchInputProps: SwitchInputProps;
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
        <div className={s.switchField__label}>
          <FormLabel htmlFor={id} required={required} {...formLabelProps}>
            {label}
          </FormLabel>
        </div>
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
