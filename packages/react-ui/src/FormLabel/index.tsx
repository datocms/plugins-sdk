import React from 'react';
import cn from 'classnames';
import s from './styles.module.css.json';

export interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: boolean;
  code?: React.ReactNode;
}

export const FormLabel = ({
  children,
  className,
  htmlFor,
  code,
  required = false,
  error = false,
  ...otherProps
}: FormLabelProps): JSX.Element => {
  const classNames = cn(s.formLabel, className, {
    [s['formLabel--error']]: error,
  });

  return (
    <label className={classNames} htmlFor={htmlFor} {...otherProps}>
      <span className={s.formLabel__label}>{children}</span>
      {required && <span className={s.formLabel__required}>*</span>}
      {code && <span className={s.formLabel__code}>{code}</span>}
    </label>
  );
};
