import { RgbaColor } from './types';

type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

export const decimalToPercentage = (v: number) =>
  Math.round((v / 255.0) * 100.0);

export function colorAsFormattedString({
  red,
  green,
  blue,
  alpha,
}: RgbaColor): string {
  const r = red.toString(16).padStart(2, '0');
  const g = green.toString(16).padStart(2, '0');
  const b = blue.toString(16).padStart(2, '0');

  return `#${r}${g}${b}${
    alpha === 255 ? '' : ` ${decimalToPercentage(alpha)}%`
  }`.toUpperCase();
}

export function toRgbCss({ red, green, blue }: RgbColor, alpha = 255) {
  if (alpha === 255) {
    return `rgb(${red}, ${green}, ${blue})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${decimalToPercentage(alpha)}%)`;
}

// Add alpha (0–255) to an existing `rgb(R, G, B)` string, producing `rgba(R, G, B, A%)`.
export function withRgbCssAlpha(rgbString: string, alpha: number): string {
  return rgbString
    .replace(/^rgb\(/, 'rgba(')
    .replace(/\)$/, `, ${decimalToPercentage(alpha)}%)`);
}

export function colorAsHex(
  { red, green, blue, alpha }: RgbaColor,
  withAlpha: boolean,
): string {
  const channels =
    withAlpha && alpha !== 255 ? [red, green, blue, alpha] : [red, green, blue];

  return `#${channels
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();
}

// Accepts `#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`, with or without the `#`.
// Returns null if the text is not a valid hex color.
export function parseHexColor(text: string): RgbaColor | null {
  const hex = text.trim().replace(/^#/, '');

  if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) {
    return null;
  }

  const full =
    hex.length <= 4
      ? hex
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : hex;

  const channel = (index: number) =>
    Number.parseInt(full.slice(index * 2, index * 2 + 2), 16);

  return {
    red: channel(0),
    green: channel(1),
    blue: channel(2),
    alpha: full.length === 8 ? channel(3) : 255,
  };
}
