import React, { ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.css';

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  buttonType?: 'primary' | 'muted' | 'negative' | 'positive';
  buttonSize?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  fullWidth?: boolean;
};

export default function Button({
  children,
  className,
  disabled,
  buttonType = 'muted',
  buttonSize = 'm',
  fullWidth,
  ...other
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
      {...other}
    >
      {children}
    </button>
  );
}
