import React from 'react';
import s from './styles.module.css.json';

export type TextProps = { children: React.ReactNode };

export function Text({ children }: TextProps): JSX.Element {
  return <div className={s.Dropdown__menu__text}>{children}</div>;
}
