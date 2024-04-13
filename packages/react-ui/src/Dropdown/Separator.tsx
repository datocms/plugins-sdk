import React, { useContext } from 'react';
import { MenuContext } from './MenuContext';
import s from './styles.module.css.json';

export const Separator = (): JSX.Element | null => {
  const { searchTerm } = useContext(MenuContext);

  if (searchTerm) {
    return null;
  }

  return <div className={s.Dropdown__menu__separator} />;
};
