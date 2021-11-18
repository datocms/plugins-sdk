import React, { ReactNode } from 'react';
import { RenderProperties } from 'datocms-plugins-sdk';
import styles from './styles.module.css.json';

export type CanvasProps = {
  ctx: RenderProperties;
  children: ReactNode;
};

export default function Canvas({ ctx, children }: CanvasProps): JSX.Element {
  return (
    <div
      className={styles.canvas}
      style={Object.entries(ctx.theme).reduce(
        (acc, [k, v]) => ({ ...acc, [`--${k}`]: v }),
        {},
      )}
    >
      {children}
    </div>
  );
}
