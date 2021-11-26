import React, { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.css.json';

export type ButtonProps = {
  children?: ReactNode;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
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
 * @example
 *   <Canvas ctx={ctx}>
 *     <div>
 *       <Button type="button">Submit</Button>
 *       <Button type="button" disabled>
 *         Submit
 *       </Button>
 *     </div>
 *     <div>
 *       <Button type="button" buttonType="primary">
 *         Submit
 *       </Button>
 *       <Button type="button" buttonType="primary" disabled>
 *         Submit
 *       </Button>
 *     </div>
 *     <div>
 *       <Button type="button" buttonType="negative">
 *         Submit
 *       </Button>
 *       <Button type="button" buttonType="negative" disabled>
 *         Submit
 *       </Button>
 *     </div>
 *   </Canvas>;
 *
 * @example
 *   <Canvas ctx={ctx}>
 *     <Button type="button" fullWidth>
 *       Submit
 *     </Button>
 *   </Canvas>;
 *
 * @example
 *   <Canvas ctx={ctx}>
 *     <Button type="button" buttonSize="xxs">
 *       Submit
 *     </Button>
 *     <Button type="button" buttonSize="xs">
 *       Submit
 *     </Button>
 *     <Button type="button" buttonSize="s">
 *       Submit
 *     </Button>
 *     <Button type="button" buttonSize="m">
 *       Submit
 *     </Button>
 *     <Button type="button" buttonSize="l">
 *       Submit
 *     </Button>
 *     <Button type="button" buttonSize="xl">
 *       Submit
 *     </Button>
 *   </Canvas>;
 *
 * @example
 *   <Canvas ctx={ctx}>
 *     <Button type="button" leftIcon={<PlusIcon />}>
 *       Submit
 *     </Button>
 *     <Button type="button" rightIcon={<ChevronDownIcon />}>
 *       Submit
 *     </Button>
 *     <Button type="button" leftIcon={<PlusIcon />} />
 *   </Canvas>;
 *
 * @exampleNames basic, fullWidth, size, icons
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
      {leftIcon && <span className={styles['button__leftIcon']}>{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className={styles['button__rightIcon']}>{rightIcon}</span>}
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
      {leftIcon && <span className={styles['button__leftIcon']}>{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className={styles['button__rightIcon']}>{rightIcon}</span>}
    </a>
  );
}
