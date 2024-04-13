import React from 'react';
import type { ReactNode } from 'react';
import s from './styles.module.css.json';

export type GroupProps = {
  children: React.ReactNode;
  name: ReactNode;
};

export const Group = ({ children, name }: GroupProps): JSX.Element => {
  return (
    <div>
      <div className={s.Dropdown__menu__group__title}>{name}</div>
      <div className={s.Dropdown__menu__group__content}>{children}</div>
    </div>
  );
};
