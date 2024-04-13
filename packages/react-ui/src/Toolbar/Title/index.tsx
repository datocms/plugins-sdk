import classNames from 'classnames';
import React, { type CSSProperties, type ReactNode } from 'react';
import s from './styles.module.css.json';

export type TitleProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Title({ children, style, className }: TitleProps): JSX.Element {
  return (
    <div className={classNames(s.Title, className)} style={style}>
      {children}
    </div>
  );
}
