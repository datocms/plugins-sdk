import React, { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.css.json';

export type ButtonProps = {
  children: ReactNode;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
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
  type = 'button',
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
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

export type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  className?: string;
  onClick?: MouseEventHandler;
  buttonType?: 'primary' | 'muted' | 'negative';
  buttonSize?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  fullWidth?: boolean;
  style?: CSSProperties;
};

export function ButtonLink({
  children,
  href,
  target = '_blank',
  className,
  buttonType = 'muted',
  buttonSize = 'm',
  onClick,
  fullWidth,
  style,
}: ButtonLinkProps): JSX.Element {
  return (
    <a
      href={href}
      target={target}
      className={cn(
        styles.button,
        styles[`buttonType-${buttonType}`],
        styles[`buttonSize-${buttonSize}`],
        {
          [styles.fullWidth]: fullWidth,
        },
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
