import React, { useEffect, useMemo, useRef } from 'react';

// The decoder of ThumbHash (https://evanw.github.io/thumbhash/), by Evan
// Wallace, MIT license
function thumbHashToApproximateAspectRatio(hash: Uint8ClampedArray) {
  const header = hash[3];
  const hasAlpha = hash[2] & 0x80;
  const isLandscape = hash[4] & 0x80;
  const lx = isLandscape ? (hasAlpha ? 5 : 7) : header & 7;
  const ly = isLandscape ? header & 7 : hasAlpha ? 5 : 7;
  return lx / ly;
}

function thumbHashToRGBA(hash: Uint8ClampedArray) {
  const { PI, min, max, cos, round } = Math;

  // Read the constants
  const header24 = hash[0] | (hash[1] << 8) | (hash[2] << 16);
  const header16 = hash[3] | (hash[4] << 8);
  const l_dc = (header24 & 63) / 63;
  const p_dc = ((header24 >> 6) & 63) / 31.5 - 1;
  const q_dc = ((header24 >> 12) & 63) / 31.5 - 1;
  const l_scale = ((header24 >> 18) & 31) / 31;
  const hasAlpha = header24 >> 23;
  const p_scale = ((header16 >> 3) & 63) / 63;
  const q_scale = ((header16 >> 9) & 63) / 63;
  const isLandscape = header16 >> 15;
  const lx = max(3, isLandscape ? (hasAlpha ? 5 : 7) : header16 & 7);
  const ly = max(3, isLandscape ? header16 & 7 : hasAlpha ? 5 : 7);
  const a_dc = hasAlpha ? (hash[5] & 15) / 15 : 1;
  const a_scale = (hash[5] >> 4) / 15;

  // Read the varying factors (boost saturation by 1.25x to compensate for quantization)
  const ac_start = hasAlpha ? 6 : 5;
  let ac_index = 0;
  const decodeChannel = (nx: number, ny: number, scale: number) => {
    const ac: number[] = [];
    for (let cy = 0; cy < ny; cy++)
      for (let cx = cy ? 0 : 1; cx * ny < nx * (ny - cy); cx++)
        ac.push(
          (((hash[ac_start + (ac_index >> 1)] >> ((ac_index++ & 1) << 2)) &
            15) /
            7.5 -
            1) *
            scale,
        );
    return ac;
  };
  const l_ac = decodeChannel(lx, ly, l_scale);
  const p_ac = decodeChannel(3, 3, p_scale * 1.25);
  const q_ac = decodeChannel(3, 3, q_scale * 1.25);
  const a_ac = hasAlpha ? decodeChannel(5, 5, a_scale) : [];

  // Decode using the DCT into RGB
  const ratio = thumbHashToApproximateAspectRatio(hash);
  const w = round(ratio > 1 ? 32 : 32 * ratio);
  const h = round(ratio > 1 ? 32 / ratio : 32);
  const rgba = new Uint8ClampedArray(w * h * 4);
  const fx: number[] = [];
  const fy: number[] = [];
  for (let y = 0, i = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 4) {
      let l = l_dc;
      let p = p_dc;
      let q = q_dc;
      let a = a_dc;

      // Precompute the coefficients
      for (let cx = 0, n = max(lx, hasAlpha ? 5 : 3); cx < n; cx++)
        fx[cx] = cos((PI / w) * (x + 0.5) * cx);
      for (let cy = 0, n = max(ly, hasAlpha ? 5 : 3); cy < n; cy++)
        fy[cy] = cos((PI / h) * (y + 0.5) * cy);

      // Decode L
      for (let cy = 0, j = 0; cy < ly; cy++)
        for (
          let cx = cy ? 0 : 1, fy2 = fy[cy] * 2;
          cx * ly < lx * (ly - cy);
          cx++, j++
        )
          l += l_ac[j] * fx[cx] * fy2;

      // Decode P and Q
      for (let cy = 0, j = 0; cy < 3; cy++) {
        for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx < 3 - cy; cx++, j++) {
          const f = fx[cx] * fy2;
          p += p_ac[j] * f;
          q += q_ac[j] * f;
        }
      }

      // Decode A
      if (hasAlpha)
        for (let cy = 0, j = 0; cy < 5; cy++)
          for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx < 5 - cy; cx++, j++)
            a += a_ac[j] * fx[cx] * fy2;

      // Convert to RGB
      const b = l - (2 / 3) * p;
      const r = (3 * l - b + q) / 2;
      const g = r - q;
      rgba[i] = max(0, 255 * min(1, r));
      rgba[i + 1] = max(0, 255 * min(1, g));
      rgba[i + 2] = max(0, 255 * min(1, b));
      rgba[i + 3] = max(0, 255 * min(1, a));
    }
  }
  return { w, h, rgba };
}

function decodeThumbhash(thumbhash: string) {
  return thumbHashToRGBA(
    new Uint8ClampedArray(
      atob(thumbhash)
        .split('')
        .map((x) => x.charCodeAt(0)),
    ),
  );
}

type ThumbhashCanvasProps = {
  thumbhash: string;
  style?: React.CSSProperties;
};

/** The blurred picture of a thumbhash, while the real image loads */
export function ThumbhashCanvas({ thumbhash, style }: ThumbhashCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const result = useMemo(() => decodeThumbhash(thumbhash), [thumbhash]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context) {
      return;
    }

    context.putImageData(new ImageData(result.rgba, result.w, result.h), 0, 0);
  }, [result]);

  return (
    <canvas ref={canvasRef} style={style} width={result.w} height={result.h} />
  );
}

/**
 * The blurred picture of a thumbhash as a PNG data URI, for a `poster` or a
 * CSS background. It is null on a server, which has no canvas.
 */
export function useThumbhashDataUri(thumbhash: string | null) {
  return useMemo(() => {
    if (!thumbhash || typeof document === 'undefined') {
      return null;
    }

    const result = decodeThumbhash(thumbhash);
    const canvas = document.createElement('canvas');
    canvas.width = result.w;
    canvas.height = result.h;

    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    context.putImageData(new ImageData(result.rgba, result.w, result.h), 0, 0);

    return canvas.toDataURL('image/png');
  }, [thumbhash]);
}
