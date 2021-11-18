import React, { ReactNode, useEffect } from 'react';
import { RenderProperties, SizingUtilities } from 'datocms-plugins-sdk';
import styles from './styles.module.css.json';

export type CanvasProps = {
  ctx: RenderProperties;
  noAutoResizer?: boolean;
  children: ReactNode;
};

export function Canvas({
  ctx,
  children,
  noAutoResizer,
}: CanvasProps): JSX.Element {
  const { mode } = (ctx as unknown) as { mode: string };

  useEffect(() => {
    if (mode !== 'renderPage' && !noAutoResizer) {
      const ctxWithAutoResizer = (ctx as unknown) as SizingUtilities;
      ctxWithAutoResizer.startAutoResizer();

      () => {
        ctxWithAutoResizer.stopAutoResizer();
      };
    }
  }, [mode, noAutoResizer]);

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
