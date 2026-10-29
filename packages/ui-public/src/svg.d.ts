// The type of an SVG file that vite-plugin-svgr changes into a React
// component (the "?react" query). The apps get the same type from
// vite-plugin-svgr/client.
declare module '*.svg?react' {
  import type { ComponentProps, FunctionComponent } from 'react';

  const ReactComponent: FunctionComponent<
    ComponentProps<'svg'> & {
      title?: string;
      titleId?: string;
      desc?: string;
      descId?: string;
    }
  >;
  export default ReactComponent;
}
