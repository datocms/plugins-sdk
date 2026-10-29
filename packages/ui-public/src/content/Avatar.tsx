import classNames from 'classnames';
import md5 from 'min-md5';
import React, { forwardRef, useCallback, useState } from 'react';
import { Users } from '../../icons';
import Image from '../semantic/Image';
import InitialsAvatar, { initialsFor } from './InitialsAvatar';

/**
 * "small" is 20px, "regular" is 30px, "large" is 40px, "xlarge" is 48px.
 * The regular and the large avatars have a ring, so avatars in a stack stay
 * apart. The xlarge avatar is for a single person, for example the header of
 * a profile, thus it has no ring.
 */
export type AvatarSize = 'small' | 'regular' | 'large' | 'xlarge';

/** The side of each size in pixels, for example to ask an image of that size */
export const AVATAR_SIZE_IN_PIXELS: Record<AvatarSize, number> = {
  small: 20,
  regular: 30,
  large: 40,
  xlarge: 48,
};

/** The image of the avatar: a URL, or the Gravatar image of the email */
type AvatarImage =
  /** An image URL */
  | {
      /**
       * The URL of the image. When it is missing or when it does not load,
       * the avatar shows the initials of the name.
       */
      imageUrl?: string | null;
      gravatar?: never;
    }
  /** The Gravatar image of the email */
  | {
      /**
       * Shows the Gravatar image of the email, with two image pixels for
       * each CSS pixel. When the email has no Gravatar image or when there is
       * no email, the avatar shows the initials of the name.
       */
      gravatar: true;
      imageUrl?: never;
    };

/** The person of the avatar: the name, the email and the image */
export type AvatarIdentity = AvatarImage & {
  /** The name of the person, for example "Jane Doe". It gives the initials. */
  name: string | null | undefined;
  /** Picks the color of the initials. Falls back to the name when missing. */
  email?: string | null;
};

export type AvatarProps = AvatarIdentity & {
  /** @default "regular" */
  size?: AvatarSize;
  /**
   * Shows a highlight around the avatar, for example for the user that edits
   * @default false
   */
  active?: boolean;
  /**
   * Gives the name to the screen readers. Use it only when no text near the
   * avatar has the name, for example in a stack of avatars. Without it, the
   * screen readers do not read the avatar.
   * @default false
   */
  labelled?: boolean;
};

// "d=404" makes Gravatar reply with an error when the email has no image,
// thus the img calls onError and the avatar shows the initials.
function gravatarUrl(email: string, pixels: number) {
  return `https://secure.gravatar.com/avatar/${md5(
    email.trim().toLowerCase(),
  )}?${new URLSearchParams({ s: String(pixels), d: '404' })}`;
}

/**
 * The avatar of a person. It does not know where the person comes from: the
 * app reads the name, the email and the image URL and gives them.
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      size = 'regular',
      active = false,
      name,
      email,
      imageUrl,
      gravatar,
      labelled = false,
    },
    ref,
  ) => {
    const url = gravatar
      ? email
        ? gravatarUrl(email, AVATAR_SIZE_IN_PIXELS[size] * 2)
        : null
      : imageUrl;

    const [failedUrl, setFailedUrl] = useState<string | null>(null);

    const handleError = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        setFailedUrl(event.currentTarget.src);
      },
      [],
    );

    return (
      <div
        className={classNames(`Avatar Avatar--${size}`, {
          'is-active': active,
        })}
        ref={ref}
      >
        {url && failedUrl !== url ? (
          <Image
            src={url}
            alt={labelled ? name || '' : ''}
            onError={handleError}
          />
        ) : initialsFor(name) ? (
          <InitialsAvatar
            name={name}
            surface={email ? { seed: email } : undefined}
            size={AVATAR_SIZE_IN_PIXELS[size]}
            labelled={labelled}
          />
        ) : (
          // A name without a letter or a digit gives no initials: the avatar
          // shows a person on the muted surface
          <>
            <InitialsAvatar
              name={name}
              surface="muted"
              size={AVATAR_SIZE_IN_PIXELS[size]}
              labelled={labelled}
            />
            <Users.UserIcon className="Avatar__person" aria-hidden />
          </>
        )}
      </div>
    );
  },
);

export default Avatar;
