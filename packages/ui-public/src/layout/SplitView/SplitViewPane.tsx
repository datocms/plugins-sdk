import React, { PropsWithChildren } from 'react';

export type Props = {
  maxSize?: number | string;
  minSize?: number | string;
  style?: React.CSSProperties;
};

export default function SplitViewPane({
  style,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="SplitViewPane" style={style}>
      {children}
    </div>
  );
}
