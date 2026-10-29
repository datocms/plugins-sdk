import React, { type SyntheticEvent } from 'react';
import DropdownTriggerButton from '../../actions/Dropdown/triggers/DropdownTriggerButton';
import Avatar, { type AvatarIdentity } from '../../content/Avatar';
import type { Message } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';
import type { FloatingTrigger } from '../../overlays/floatingTrigger';
import Tooltip from '../../overlays/Tooltip';

/** The user to show: the name, the email and the image of the avatar */
export type InfoListUserData = AvatarIdentity;

export type InfoListUserProps = {
  user: InfoListUserData;
  /**
   * A text about the user, for example the type of the user. It goes in a
   * tooltip at the left, thus the text does not wrap in a narrow column.
   * Without it, there is no tooltip.
   */
  tooltip?: Message;
};

export type InfoListUserTriggerProps = InfoListUserProps & {
  /** The menu is open. Dropdown gives it. */
  open: boolean;
  /** Opens or closes the menu. Dropdown gives it. */
  onTrigger: (event: SyntheticEvent) => void;
  /**
   * The pointer or the keyboard focus is on the trigger: the user will
   * possibly open the menu. Use it to start to load the options of the menu.
   */
  onIntent?: () => void;
};

function Content({ user }: { user: InfoListUserData }) {
  return (
    <>
      <Avatar {...user} size="small" />
      <span className="InfoList__value__label">{user.name}</span>
    </>
  );
}

function UserTooltip({
  tooltip,
  children,
}: {
  tooltip: Message | undefined;
  children: FloatingTrigger;
}) {
  if (!tooltip) {
    return children;
  }

  return (
    <Tooltip placement="left" label={tooltip}>
      {children}
    </Tooltip>
  );
}

/**
 * The trigger of a Dropdown that changes the user, for example the creator
 * of a record. Give it to `triggerComponent` of `Dropdown`.
 */
function UserTrigger({
  user,
  tooltip,
  open,
  onTrigger,
  onIntent,
}: InfoListUserTriggerProps) {
  return (
    <UserTooltip tooltip={tooltip}>
      <DropdownTriggerButton
        open={open}
        onTrigger={onTrigger}
        className="InfoList__value is-editable button--ghost-inline"
        onPointerEnter={onIntent}
        onFocus={onIntent}
      >
        <Content user={user} />
        <MenuChevron />
      </DropdownTriggerButton>
    </UserTooltip>
  );
}

/**
 * A user in a row of an InfoList, for example the creator of a record: the
 * avatar and the name. Use `InfoList.User.Trigger` when the user can change
 * it.
 */
function User({ user, tooltip }: InfoListUserProps) {
  return (
    <UserTooltip tooltip={tooltip}>
      <div className="InfoList__value">
        <Content user={user} />
      </div>
    </UserTooltip>
  );
}

export default Object.assign(React.memo(User), {
  Trigger: React.memo(UserTrigger),
});
