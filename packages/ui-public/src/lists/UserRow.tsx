import React, { type ReactNode } from 'react';
import Avatar, { type AvatarSize } from '../content/Avatar';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import EntityRow from './EntityRow';

/**
 * A person as the API gives it, and as `ctx` gives it to a plugin (for
 * example `ctx.currentUser`, `ctx.loadUsers()`): a collaborator, an account,
 * an organization, an SSO user, an API token or an invitation. The row reads
 * only these fields.
 */
export type UserRowEntity =
  | {
      type: 'user';
      attributes: { full_name?: string | null; email: string };
    }
  | {
      type: 'account';
      attributes: {
        first_name?: string | null;
        last_name?: string | null;
        email: string;
      };
    }
  | {
      type: 'organization';
      attributes: { name: string };
    }
  | {
      type: 'sso_user';
      attributes: {
        first_name?: string | null;
        last_name?: string | null;
        username: string;
      };
    }
  | {
      type: 'access_token';
      attributes: { name?: string | null };
    }
  | {
      type: 'site_invitation';
      attributes: { email: string };
    };

/** The data of a person that the row shows */
export type UserRowPresentation = {
  /** The name. Without it, the email is the title. */
  name: string | null | undefined;
  /** The email. It gives the Gravatar image and the color of the initials. */
  email: string | null | undefined;
  /**
   * The URL of the image of the avatar. Without it, the avatar is the
   * Gravatar image of the email, and the initials of the name when the
   * email has no Gravatar image.
   */
  imageUrl?: string | null;
};

function fullName(...parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/**
 * The name and the email of a person, as DatoCMS shows them. The name falls
 * back to the email. It is null only for an API token without a name: show
 * the kind (`userKindLabel`) in its place.
 */
export function userPresentation(user: UserRowEntity): {
  name: string | null;
  email: string | null;
} {
  let name: string | null | undefined = null;
  let email: string | null = null;

  switch (user.type) {
    case 'account':
      email = user.attributes.email;
      name = fullName(user.attributes.first_name, user.attributes.last_name);
      break;
    case 'organization':
      name = user.attributes.name;
      break;
    case 'user':
      email = user.attributes.email;
      name = user.attributes.full_name;
      break;
    case 'site_invitation':
      email = user.attributes.email;
      break;
    case 'access_token':
      name = user.attributes.name;
      break;
    case 'sso_user':
      email = user.attributes.username;
      name = fullName(user.attributes.first_name, user.attributes.last_name);
      break;
  }

  return { name: name || email || null, email };
}

const kindLabels: Record<UserRowEntity['type'], string> = {
  account: 'userType.account',
  organization: 'userType.organization',
  user: 'userType.user',
  access_token: 'userType.apiToken',
  sso_user: 'userType.ssoUser',
  site_invitation: 'userType.siteInvitation',
};

/** The name of the kind of a person, for example "SSO user" */
export function userKindLabel(type: UserRowEntity['type']): TextMessage {
  return { id: kindLabels[type] };
}

type Content =
  /** The person as the API gives it */
  | {
      /** The person. The row reads its name and its email. */
      user: UserRowEntity;
      /**
       * Shows the kind of the person after the name, for example "SSO
       * user". Use it when the list or the menu mixes people of different
       * kinds.
       * @default false
       */
      showKind?: boolean;
      presentation?: never;
      kind?: never;
    }
  /** The data of the person, already resolved */
  | {
      /** The name, the email and the image of the person */
      presentation: UserRowPresentation;
      /**
       * The kind of person, after the name in the subtle ink. For example
       * "SSO user", "API token" or "Invitation".
       */
      kind?: Message;
      user?: never;
      showKind?: never;
    };

type Layout =
  | {
      /**
       * "row" shows the email below the name, with an avatar of 32px: a row
       * of a list, an option of a menu.
       */
      layout: 'row';
      /**
       * The line below the name, in place of the email. Write the email in
       * it when the row needs it.
       */
      children?: ReactNode;
    }
  | {
      /**
       * "inline" shows the name on one line, with an avatar of 20px: a
       * chip, the value of a select, a cell of a table, a person in a text.
       */
      layout: 'inline';
      children?: never;
    };

export type UserRowProps = Content & Layout;

// The image slot of EntityRow gives the size of the avatar (20px inline,
// 32px in a row). No avatar size is 32px. "xlarge" has no ring, and its
// image is sharp at 32px.
const avatarSizes: Record<UserRowProps['layout'], AvatarSize> = {
  inline: 'small',
  row: 'xlarge',
};

/**
 * A person in a row: the avatar, the name, the email and the kind. It
 * shows only the content: the container gives the surface, the hover and
 * the click.
 */
function UserRow(props: UserRowProps) {
  const { tm } = useTranslation();
  const { layout } = props;

  let name: string | null | undefined;
  let email: string | null | undefined;
  let imageUrl: string | null | undefined;
  let kind: Message | undefined;

  if (props.user) {
    ({ name, email } = userPresentation(props.user));
    const kindLabel = userKindLabel(props.user.type);
    name = name || tm(kindLabel);
    kind = props.showKind ? kindLabel : undefined;
  } else {
    ({ name, email, imageUrl } = props.presentation);
    kind = props.kind;
  }

  const title = name || email || '';
  // The name is next to the avatar, thus the avatar is decorative
  const image = (
    <Avatar
      name={name}
      email={email}
      size={avatarSizes[layout]}
      {...(imageUrl ? { imageUrl } : { gravatar: true })}
    />
  );

  if (layout === 'inline') {
    return (
      <EntityRow layout="inline" image={image} title={title} aside={kind} />
    );
  }

  return (
    <EntityRow layout="row" image={image} title={title} aside={kind}>
      {props.children ?? (email && email !== title ? email : undefined)}
    </EntityRow>
  );
}

export default UserRow;
