import { RenderProperties } from 'datocms-plugin-sdk';
import { CSSProperties } from 'react';

function camelToDash(str: string) {
  if (str != str.toLowerCase()) {
    str = str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  }
  return str;
}

export function generateStyleFromCtx(ctx: RenderProperties): CSSProperties {
  return Object.entries(ctx.theme).reduce(
    (acc, [k, v]) => {
      return {
        ...acc,
        [`--${camelToDash(k)}`]: v,
        [`--${camelToDash(`${k}RgbComponents`)}`]:
          v.match(/rgb\((\d+, \d+, \d+)\)/)?.[1] || undefined,
      };
    },
    {
      padding: ctx.bodyPadding.map((p) => `${p}px`).join(' '),
    },
  );
}
