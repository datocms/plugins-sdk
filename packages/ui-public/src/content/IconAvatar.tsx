import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { type SvgIcon } from '../utils/types';

/** The surface of the square */
export type IconAvatarSurface =
  /**
   * The soft brand surface, for the thing that is active or that matters
   * (the environment in use)
   */
  | 'primary'
  /** The neutral surface */
  | 'muted'
  /**
   * A surface and an ink from the data or from a context of tokens, for
   * example `{ color: 'var(--color--field-group-media--surface)', ink:
   * 'var(--color--field-group-media--ink)' }`
   */
  | { color: string; ink: string };

export type IconAvatarProps = {
  /** The icon, for example the icon of a kind of entity */
  icon: SvgIcon;
  /** The side of the square in pixels, for example 32 in the image of an EntityRow */
  size: number;
  /** @default "primary" */
  surface?: IconAvatarSurface;
  /**
   * The name for the screen readers. Use it only when no text near the
   * avatar tells what the icon shows. Without it, the screen readers do not
   * read the avatar.
   */
  ariaLabel?: TextMessage;
};

/**
 * An icon on a soft rounded square, with the shape of an avatar. Use it for
 * a thing that has an icon and no image: an environment, a kind of field.
 * For a person, use Avatar; for a name, use InitialsAvatar.
 */
const IconAvatar = React.memo(function IconAvatar({
  icon: Icon,
  size,
  surface = 'primary',
  ariaLabel,
}: IconAvatarProps) {
  const { tm } = useTranslation();

  const colors = typeof surface === 'object' ? surface : undefined;

  const style = useMemo(
    () =>
      ({
        '--Avatar-icon-size': `${size}px`,
        ...(colors && {
          '--Avatar-surface': colors.color,
          '--Avatar-ink': colors.ink,
        }),
      }) as React.CSSProperties,
    [size, colors?.color, colors?.ink],
  );

  return (
    <span
      className={classNames('Avatar__icon', {
        [`Avatar__icon--${surface}`]: !colors,
      })}
      style={style}
      {...(ariaLabel
        ? { role: 'img', 'aria-label': tm(ariaLabel) }
        : { 'aria-hidden': true })}
    >
      <Icon />
    </span>
  );
});

export default IconAvatar;
