import type { CSSProperties } from 'react';
import type { BaseCtx } from '../Canvas';

function camelToDash(str: string) {
  if (str === str.toLowerCase()) {
    return str;
  }
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

export function generateStyleFromCtx(
  ctx: BaseCtx,
  noBodyPadding = false,
): CSSProperties {
  return {
    padding: noBodyPadding
      ? undefined
      : ctx.bodyPadding.map((p) => `${p}px`).join(' '),
    // Legacy, deprecated color tokens
    ...Object.fromEntries(
      Object.entries(ctx.theme).flatMap(([k, v]) => [
        [`--${camelToDash(k)}`, v],
        [
          `--${camelToDash(`${k}RgbComponents`)}`,
          v.match(/rgb\((\d+, \d+, \d+)\)/)?.[1] || undefined,
        ],
      ]),
    ),
    // Semantic color tokens arrive keyed by their final CSS custom property
    // name (e.g. `--color--surface-raised`), so they're applied verbatim. The
    // SDK stays agnostic of the token vocabulary: whatever the host sends ends
    // up on the canvas, and plugin CSS references it with `var(--…)`.
    ...ctx.semanticColorTokensTheme,
  };
}
