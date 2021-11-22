import React, { ReactNode } from 'react';
import s from './styles.module.css.json';

type FieldErrorProps = {
  children: ReactNode;
};

export function FieldError({ children }: FieldErrorProps): JSX.Element {
  return <div className={s.fieldError}>{children}</div>;
}
