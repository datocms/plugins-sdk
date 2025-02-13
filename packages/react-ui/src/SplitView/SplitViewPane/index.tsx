import React, { PropsWithChildren } from 'react';
import s from './styles.module.css.json';

export type SplitViewPaneProps = {
  maxSize?: number | string;
  minSize?: number | string;
  style?: React.CSSProperties;
};

export function SplitViewPane({
  style,
  children,
}: PropsWithChildren<SplitViewPaneProps>) {
  return (
    <div className={s.SplitViewPane} style={style}>
      {children}
    </div>
  );
}
