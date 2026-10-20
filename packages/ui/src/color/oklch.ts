// ============================================================================
// OKLCH math
// ============================================================================
//
// OKLCH is a modern, perceptually-uniform color space (lightness L, chroma C,
// hue H). Equal numerical L steps look like equal visual steps; chroma
// measures how saturated/colorful the color is; hue is an angle on the
// color wheel.
//
// All the matrix constants here come from Björn Ottosson's original OKLab
// publication (https://bottosson.github.io/posts/oklab/). Three coordinate
// spaces are involved:
//
//   sRGB         what we read from the API and what monitors show. Non-linear
//                (gamma-encoded). Channel range [0, 255] or normalised [0, 1].
//   linear RGB   what you get by undoing the sRGB gamma curve. Linear in
//                light energy — doubling a value doubles the photon count.
//                Required for any luminance math (e.g. WCAG contrast).
//   OKLab/OKLCH  perceptually-uniform. OKLab is Cartesian (L, a, b);
//                OKLCH is the polar form (L, C, h).
//
// Conversion order both ways:
//
//   sRGB ↔ linear RGB ↔ OKLab ↔ OKLCH
//
// The functions below cover the directions we actually need. We never need
// sRGB → OKLab → OKLCH in JS (we only ingest the four legacy API colors,
// and that's where `rgbToOklch` is used).

import { decimalToPercentage } from './utils';

export type Oklch = { l: number; c: number; h: number };

// OKLCH → linear RGB.
//
// Conceptually: rotate (C, h) back to Cartesian (a, b), run the inverse
// OKLab → linear RGB matrix. Output channels may fall outside [0, 1] for
// (L, C, H) combinations that lie outside the sRGB gamut.
export function oklchToLinearRgb({ l, c, h }: Oklch): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lOklab = l + 0.3963377774 * a + 0.2158037573 * b;
  const mOklab = l - 0.1055613458 * a - 0.0638541728 * b;
  const sOklab = l - 0.0894841775 * a - 1.291485548 * b;

  const L = lOklab ** 3;
  const M = mOklab ** 3;
  const S = sOklab ** 3;

  return [
    +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

// Relative luminance per WCAG. Operates on LINEAR RGB (NOT sRGB-encoded).
// Used for contrast-ratio checks: contrast(a, b) = (L_lighter + 0.05) /
// (L_darker + 0.05), needs to be >= 4.5 for AA on body text.
export function linearRgbToLuminance(rgb: [number, number, number]): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Is the given linear RGB triple representable as a real sRGB color?
// Allows a tiny epsilon to absorb floating-point noise at the gamut
// boundary so we don't reject colors that are visually in-gamut.
function inGamut(rgb: [number, number, number]): boolean {
  return rgb.every((c) => c >= -0.0001 && c <= 1.0001);
}

// Maximum chroma at (L, H) that still produces an in-gamut sRGB color.
// Bisects over C; chroma is monotone in "out-of-gamut-ness" at fixed L
// and H, so bisection always finds the boundary. 20 iterations →
// tolerance ≈ cap / 2^20, far below the visible threshold.
//
// `cap` upper-bounds the search range. 0.4 is well above any in-gamut
// OKLCH chroma — sRGB's maximum chroma across all hues sits around 0.32.
export function maxInGamutChroma(l: number, h: number, cap = 0.4): number {
  let lo = 0;
  let hi = cap;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinearRgb({ l, c: mid, h }))) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

// linear → sRGB gamma encoding (standard sRGB transfer function).
function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  if (clamped <= 0.0031308) return 12.92 * clamped;
  return 1.055 * clamped ** (1 / 2.4) - 0.055;
}

// OKLCH → `H, S%, L%` string for GraphiQL's `--graphiql-color-*` custom
// properties. GraphiQL interpolates these into `hsl(${var}, ...)` in its
// own stylesheet, so we have to land on HSL specifically. This is the only
// place in the app that needs the HSL color space.
export function oklchToHslComponents(oklch: Oklch): string {
  const linear = oklchToLinearRgb(oklch);
  const r = linearToSrgb(linear[0]);
  const g = linearToSrgb(linear[1]);
  const b = linearToSrgb(linear[2]);

  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  const hRaw = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  const H = 60 * hRaw < 0 ? 60 * hRaw + 360 : 60 * hRaw;
  const S = delta
    ? max <= 0.5
      ? delta / (2 * max - delta)
      : delta / (2 - (2 * max - delta))
    : 0;
  const L = (2 * max - delta) / 2;

  return `${H}, ${Math.round(100 * S)}%, ${Math.round(100 * L)}%`;
}

// Format an Oklch as a CSS `oklch(L C H)` string, optionally with alpha.
// `alpha` is in [0, 1]; the function appends a `/ NN%` only when alpha < 1.
export function formatOklch(oklch: Oklch, alpha = 1): string {
  const base = `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)}`;
  if (alpha < 1) {
    return `${base} / ${decimalToPercentage(alpha * 255)}%)`;
  }
  return `${base})`;
}

// Converts one gamma-encoded sRGB channel (0–1) to linear light.
export function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

// sRGB → OKLCH. Used to ingest the four explicit theme colors from the API
// (which are RGB triplets) and convert them to our internal OKLCH form.
export function rgbToOklch({
  red,
  green,
  blue,
}: {
  red: number;
  green: number;
  blue: number;
}): Oklch {
  const r = srgbToLinear(red / 255);
  const g = srgbToLinear(green / 255);
  const b = srgbToLinear(blue / 255);

  const L = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const M = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const S = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const lOklab = Math.cbrt(L);
  const mOklab = Math.cbrt(M);
  const sOklab = Math.cbrt(S);

  const lab_l =
    0.2104542553 * lOklab + 0.793617785 * mOklab - 0.0040720468 * sOklab;
  const lab_a =
    1.9779984951 * lOklab - 2.428592205 * mOklab + 0.4505937099 * sOklab;
  const lab_b =
    0.0259040371 * lOklab + 0.7827717662 * mOklab - 0.808675766 * sOklab;

  const c = Math.sqrt(lab_a * lab_a + lab_b * lab_b);
  const h = ((Math.atan2(lab_b, lab_a) * 180) / Math.PI + 360) % 360;

  return { l: lab_l, c, h };
}

// OKLCH CSS string → `rgb(R, G, B)` string. Used when callers need an RGB
// representation of a ramp stop (e.g. ThemeColors in monochromatic mode).
export function oklchStringToRgbCss(oklchString: string): string {
  const oklch = parseOklch(oklchString);
  if (!oklch) return oklchString;
  const [lr, lg, lb] = oklchToLinearRgb(oklch);
  const r = Math.round(linearToSrgb(lr) * 255);
  const g = Math.round(linearToSrgb(lg) * 255);
  const b = Math.round(linearToSrgb(lb) * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// Parse `oklch(L C H)` or `oklch(L C H / A)` back to an Oklch object.
// Used by the subscriber for the one OKLCH-string → HSL-components round
// trip GraphiQL still needs.
export function parseOklch(s: string): Oklch | null {
  const m = s.match(
    /^oklch\(\s*([\d.eE+-]+)%?\s+([\d.eE+-]+)\s+([\d.eE+-]+)(?:\s*\/\s*[\d.%eE+-]+)?\s*\)$/,
  );
  if (!m) return null;
  return {
    l: Number.parseFloat(m[1]),
    c: Number.parseFloat(m[2]),
    h: Number.parseFloat(m[3]),
  };
}

// Parse any CSS color string we store — `oklch(...)`, `rgb(R, G, B)`, or
// `#RRGGBB`/`#RGB` hex — to an Oklch object.
export function parseColor(s: string): Oklch | null {
  const oklch = parseOklch(s);
  if (oklch) return oklch;

  const rgb = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) {
    return rgbToOklch({
      red: Number.parseInt(rgb[1], 10),
      green: Number.parseInt(rgb[2], 10),
      blue: Number.parseInt(rgb[3], 10),
    });
  }

  const hex6 = s.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (hex6) {
    return rgbToOklch({
      red: Number.parseInt(hex6[1], 16),
      green: Number.parseInt(hex6[2], 16),
      blue: Number.parseInt(hex6[3], 16),
    });
  }

  const hex3 = s.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
  if (hex3) {
    return rgbToOklch({
      red: Number.parseInt(hex3[1] + hex3[1], 16),
      green: Number.parseInt(hex3[2] + hex3[2], 16),
      blue: Number.parseInt(hex3[3] + hex3[3], 16),
    });
  }

  return null;
}
