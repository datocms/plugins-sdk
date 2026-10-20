import type { ComponentProps, FunctionComponent } from 'react';

/**
 * Type for SVG icons imported via vite-plugin-svgr.
 * Matches the type from vite-plugin-svgr/client.d.ts
 */
export type SvgIcon = FunctionComponent<
  ComponentProps<'svg'> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }
>;
