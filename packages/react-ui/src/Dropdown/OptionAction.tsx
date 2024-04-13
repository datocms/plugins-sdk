import classNames from 'classnames';
import React from 'react';
import type { ReactNode } from 'react';
import { DropdownContext } from './DropdownContext';
import s from './styles.module.css.json';

export type OptionActionProps = {
  icon: ReactNode;
  red?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closeMenuOnClick?: boolean;
};

export const OptionAction = ({
  icon,
  red,
  onClick,
  closeMenuOnClick,
}: OptionActionProps): JSX.Element => (
  <DropdownContext.Consumer>
    {(context) => (
      <button
        type="button"
        className={classNames(s.Dropdown__menu__option__icon, {
          [s['Dropdown__menu__option__icon--delete']]: red,
        })}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (closeMenuOnClick ?? true) {
            context.closeMenu();
          }
          onClick(e);
        }}
      >
        {icon}
      </button>
    )}
  </DropdownContext.Consumer>
);

OptionAction.displayName = 'DropdownOptionAction';
