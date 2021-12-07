import classNames from 'classnames';
import React, { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import s from './styles.module.css.json';

export type ButtonProps = {
  children?: ReactNode;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
};

export function Button({
  children,
  style,
  className,
  selected,
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        s['Button'],
        {
          [s['Button--selected']]: selected,
          [s['Button--disabled']]: disabled,
        },
        className,
      )}
      style={style}
    >
      {children}
    </button>
  );
}
