import type { RenderProperties } from 'datocms-plugin-sdk';
import type { CSSProperties } from 'react';

function camelToDash(str: string) {
  if (str === str.toLowerCase()) {
    return str;
  }
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

export function generateStyleFromCtx(
  ctx: RenderProperties,
  noBodyPadding = false,
): CSSProperties {
  return {
    padding: noBodyPadding
      ? undefined
      : ctx.bodyPadding.map((p) => `${p}px`).join(' '),
    ...Object.fromEntries(
      Object.entries(ctx.theme).flatMap(([k, v]) => [
        [`--${camelToDash(k)}`, v],
        [
          `--${camelToDash(`${k}RgbComponents`)}`,
          v.match(/rgb\((\d+, \d+, \d+)\)/)?.[1] || undefined,
        ],
      ]),
    ),
  };
}
