import classNames from 'classnames';
import React, {
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import s from './styles.module.css.json';

export type ButtonProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
};

export function Button({
  children,
  style,
  className,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        s.Button,

        className,
      )}
      style={style}
    >
      {children}
    </button>
  );
}
