import classNames from 'classnames';
import React, { useMemo } from 'react';
import generateColorMapper from '../color/generateColorMapper';
import { linearRgbToLuminance, srgbToLinear } from '../color/oklch';
import { parseHexColor } from '../color/utils';

/**
 * A hue number, not a color: the CSS gives the surface and the ink of each
 * hue from the semantic tokens, thus the colors change with the color scheme.
 */
const hueForSeed = generateColorMapper([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
] as const);

export function initialsFor(name: string | null | undefined) {
  return (
    (name || '')
      .trim()
      .split(/\s+/)
      // The first letter or digit of each word, as a full code point. A
      // string index gives half of an emoji (a lone surrogate) that shows as
      // a broken character, and an emoji or a bracket is not an initial.
      .map((word) => word.match(/[\p{L}\p{N}]/u)?.[0])
      .filter((initial): initial is string => Boolean(initial))
      .slice(0, 2)
      .join('')
      .toUpperCase()
  );
}

// The relative luminance of a hex color (WCAG), from 0 (black) to 1 (white).
// Gives undefined for other formats.
function luminance(hex: string): number | undefined {
  const rgb = parseHexColor(hex);

  if (!rgb) {
    return undefined;
  }

  return linearRgbToLuminance([
    srgbToLinear(rgb.red / 255),
    srgbToLinear(rgb.green / 255),
    srgbToLinear(rgb.blue / 255),
  ]);
}

/**
 * The surface of the initials. Without it, the name picks one of eight hues.
 */
export type InitialsAvatarSurface =
  /** One of eight hues, picked from the seed (for example an email) */
  | { seed: string }
  /**
   * A "#rrggbb" color from the data (for example, the dominant color of the
   * cover of a plugin). The ink is white or dark: the one with more contrast
   * on the color. A color in another format gives a hue from the name.
   */
  | { color: string }
  /** The neutral surface (for example, a plugin without a cover) */
  | 'muted';

export type InitialsAvatarProps = {
  /** The name that gives the initials, for example "Jane Doe" shows "JD" */
  name: string | null | undefined;
  /** Rendered size in pixels: smaller avatars need relatively larger text. */
  size: number;
  /** @default a hue from the name */
  surface?: InitialsAvatarSurface;
  /**
   * Gives the name to the screen readers. Use it only when no text near the
   * avatar has the name, for example in a stack of avatars. Without it, the
   * screen readers do not read the avatar.
   * @default false
   */
  labelled?: boolean;
};

/**
 * The initials of a name on a colored rounded square. Use it when there is
 * no image. For a person, use Avatar. When the name has no letter and no
 * digit (an empty name, an emoji), the square has no text.
 */
const InitialsAvatar = React.memo(function InitialsAvatar({
  name,
  size,
  surface,
  labelled = false,
}: InitialsAvatarProps) {
  const initials = initialsFor(name);
  const seed =
    typeof surface === 'object' && 'seed' in surface ? surface.seed : name;
  const color =
    typeof surface === 'object' && 'color' in surface
      ? surface.color
      : undefined;
  const colorLuminance = color ? luminance(color) : undefined;

  const style = useMemo(
    () =>
      colorLuminance !== undefined
        ? ({ '--Avatar-surface': color } as React.CSSProperties)
        : undefined,
    [color, colorLuminance],
  );

  // The contrast with white is 1.05 / (L + 0.05), with black (L + 0.05) /
  // 0.05. They are equal at L = 0.179.
  const variant =
    colorLuminance !== undefined
      ? colorLuminance > 0.179
        ? 'Avatar__initials--dark-ink'
        : 'Avatar__initials--light-ink'
      : surface === 'muted'
        ? 'Avatar__initials--muted'
        : `Avatar__initials--hue-${hueForSeed(seed || '')}`;

  return (
    // No viewBox: the user units are pixels, so the CSS can give the corners
    // the same radius token as the controls (see styles/blocks/_Avatar.css).
    // The width and the height are attributes, thus a box of the CSS (the
    // Avatar, the image of an EntityRow) can give another size.
    <svg
      width={size}
      height={size}
      className={classNames('Avatar__initials', variant)}
      style={style}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? name || undefined : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {/* The SVG draws the rounded square itself. A CSS border-radius does
          not clip an inline SVG cleanly, thus the corners of a square show at
          the edge. The CSS sets the corner radius (rx) and the colors. */}
      <rect width="100%" height="100%" />
      {initials && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * (size < 40 ? 0.4 : 0.3)}
        >
          {initials}
        </text>
      )}
    </svg>
  );
});

export default InitialsAvatar;
