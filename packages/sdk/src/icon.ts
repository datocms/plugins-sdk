import { isEmoji, isRecord, isString } from './guardUtils.js';
import type { LucideIconIdentifier } from './lucideIconIdentifier.js';

export type { LucideIconIdentifier };

/**
 * The icon of a plugin: the name of a Lucide icon
 * (https://lucide.dev/icons), or a custom SVG. Use a Lucide icon when one
 * fits: it has the stroke and the color of the rest of the interface. Keep
 * a custom SVG for the logo of a brand.
 */
export type Icon = LucideIconIdentifier | SvgDefinition;

// The guard accepts any string, because the host also draws the icon names
// that the plugins on an older SDK give.
export function isIcon(value: unknown): value is Icon {
  return isString(value) || isSvgDefinition(value);
}

/**
 * Defines a custom SVG icon for use in DatoCMS plugins.
 *
 * To create an SVG definition from an existing SVG file:
 * 1. Grab the `viewBox` attribute from your SVG element (e.g., "0 0 24 24")
 * 2. Grab everything between the `<svg>` tags as the content (all the paths, circles, etc.)
 *
 * @example
 * ```typescript
 * // From this SVG:
 * // <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 * //   <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
 * // </svg>
 *
 * const starIcon: SvgDefinition = {
 *   type: 'svg',
 *   viewBox: '0 0 24 24',
 *   content: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
 * };
 * ```
 */
export type SvgDefinition = {
  /** Always set to 'svg' to indicate this is a custom SVG icon */
  type: 'svg';

  /**
   * The viewBox attribute from your SVG element (e.g., "0 0 24 24").
   * This defines the coordinate system and aspect ratio of the SVG.
   */
  viewBox: string;

  /**
   * The inner content of your SVG element — everything between the opening and closing <svg> tags.
   * This includes all paths, circles, rectangles, and other SVG elements that make up your icon.
   */
  content: string;
};

export function isSvgDefinition(value: unknown): value is SvgDefinition {
  return (
    isRecord(value) &&
    value.type === 'svg' &&
    isString(value.viewBox) &&
    isString(value.content)
  );
}

/**
 * Defines an emoji icon for use in DatoCMS plugins.
 *
 * @example
 * ```typescript
 * const starIcon: EmojiDefinition = {
 *   type: 'emoji',
 *   emoji: '⭐'
 * };
 * ```
 */
export type EmojiDefinition = {
  /** Always set to 'emoji' to indicate this is an emoji icon */
  type: 'emoji';

  /**
   * A string contaning a single emoji.
   */
  emoji: string;
};

export function isEmojiDefinition(value: unknown): value is EmojiDefinition {
  return isRecord(value) && value.type === 'emoji' && isEmoji(value.emoji);
}

/**
 * Extended icon type that includes emoji support in addition to Lucide and SVG icons.
 * This type is specifically used for content area sidebar items where emoji icons are supported.
 */
export type IconWithEmoji = Icon | EmojiDefinition;

export function isIconWithEmoji(value: unknown): value is IconWithEmoji {
  return isIcon(value) || isEmojiDefinition(value);
}
