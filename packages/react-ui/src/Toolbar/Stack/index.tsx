import classNames from 'classnames';
import React, { CSSProperties, ReactNode } from 'react';
import s from './styles.module.css.json';

export type StackProps = {
  children?: ReactNode;
  className?: string;
  stackSize?: 's' | 'm' | 'l';
  style?: CSSProperties;
};

export function Stack({
  children,
  style,
  className,
  stackSize,
}: StackProps): JSX.Element {
  return (
    <div
      className={classNames(
        s['Stack'],
        {
          [s['Stack--s']]: stackSize === 's',
          [s['Stack--l']]: stackSize === 'l',
        },
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
