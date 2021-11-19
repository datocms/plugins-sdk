import React, { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.css.json';

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  buttonType?: 'primary' | 'muted' | 'negative';
  buttonSize?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  fullWidth?: boolean;
  style?: CSSProperties;
};

export function Button({
  children,
  className,
  disabled,
  buttonType = 'muted',
  buttonSize = 'm',
  fullWidth,
  onClick,
  style,
}: ButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        styles.button,
        styles[`buttonType-${buttonType}`],
        styles[`buttonSize-${buttonSize}`],
        {
          [styles.disabled]: disabled,
          [styles.fullWidth]: fullWidth,
        },
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
