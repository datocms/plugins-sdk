import cn from 'classnames';
import React from 'react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import styles from './styles.module.css.json';

export type ButtonProps = {
  children?: ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  buttonType?: 'primary' | 'muted' | 'negative';
  buttonSize?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  style?: CSSProperties;
};

/**
 * @example Button types
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ marginBottom: 'var(--spacing-m)' }}>
 *     <Button buttonType="muted">Submit</Button>{' '}
 *     <Button buttonType="primary">Submit</Button>{' '}
 *     <Button buttonType="negative">Submit</Button>
 *   </div>
 *   <div>
 *     <Button buttonType="muted" disabled>
 *       Submit
 *     </Button>{' '}
 *     <Button buttonType="primary" disabled>
 *       Submit
 *     </Button>{' '}
 *     <Button buttonType="negative" disabled>
 *       Submit
 *     </Button>
 *   </div>
 * </Canvas>;
 * ```
 *
 * @example Full-width
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Button fullWidth>Submit</Button>
 * </Canvas>;
 * ```
 *
 * @example Sizing
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Button buttonSize="xxs">Submit</Button>{' '}
 *   <Button buttonSize="xs">Submit</Button>{' '}
 *   <Button buttonSize="s">Submit</Button>{' '}
 *   <Button buttonSize="m">Submit</Button>{' '}
 *   <Button buttonSize="l">Submit</Button>{' '}
 *   <Button buttonSize="xl">Submit</Button>{' '}
 * </Canvas>;
 * ```
 *
 * @example Icons
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ marginBottom: 'var(--spacing-m)' }}>
 *     <Button leftIcon={<PlusIcon />}>Submit</Button>
 *   </div>
 *   <div style={{ marginBottom: 'var(--spacing-m)' }}>
 *     <Button rightIcon={<ChevronDownIcon />}>Options</Button>
 *   </div>
 *   <div>
 *     <Button leftIcon={<PlusIcon />} />
 *   </div>
 * </Canvas>;
 * ```
 */
export function Button({
  children,
  className,
  disabled,
  buttonType = 'muted',
  buttonSize = 'm',
  fullWidth,
  onClick,
  style,
  leftIcon,
  rightIcon,
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
      {leftIcon && <span className={styles.button__leftIcon}>{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && (
        <span className={styles.button__rightIcon}>{rightIcon}</span>
      )}
    </button>
  );
}

export type ButtonLinkProps = {
  children?: ReactNode;
  href: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  className?: string;
  onClick?: MouseEventHandler;
  buttonType?: 'primary' | 'muted' | 'negative';
  buttonSize?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  fullWidth?: boolean;
  style?: CSSProperties;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
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
  leftIcon,
  rightIcon,
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
      {leftIcon && <span className={styles.button__leftIcon}>{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && (
        <span className={styles.button__rightIcon}>{rightIcon}</span>
      )}
    </a>
  );
}
