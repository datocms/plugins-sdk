import React, { ReactNode } from 'react';
import s from './styles.module.css.json';

type FieldHintProps = {
  children: ReactNode;
};

export function FieldHint({ children }: FieldHintProps): JSX.Element {
  return <div className={s.fieldHint}>{children}</div>;
}
