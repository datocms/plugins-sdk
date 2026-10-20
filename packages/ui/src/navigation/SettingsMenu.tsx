import React, { ReactNode } from 'react';
import { Generic } from '../../icons';
import FeedbackDot from '../content/FeedbackDot';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import Nav from '../semantic/Nav';
import Link from './Link';
import { SidebarTree } from './SidebarTree';

export type SettingsMenuProps = {
  /** The accessible name of the menu, for example "Project settings" */
  ariaLabel: TextMessage;
  /** The SettingsMenu.Group elements */
  children: ReactNode;
  /**
   * Shows below the groups, outside of the padding of the groups. For
   * example, a SettingsMenu.Notice.
   */
  footer?: ReactNode;
};

/**
 * The menu of the sections of a settings area. It fills its Pane and
 * scrolls.
 */
function SettingsMenu({ ariaLabel, children, footer }: SettingsMenuProps) {
  const { tm } = useTranslation();

  return (
    <Nav className="SettingsMenu" ariaLabel={tm(ariaLabel)}>
      <div className="SettingsMenu__groups">{children}</div>
      {footer}
    </Nav>
  );
}

export type SettingsMenuGroupProps = {
  /** The title of the group. Without a name, the group has no title. */
  name?: Message;
  /** The SettingsMenu.Item elements */
  children: ReactNode;
};

/** A group of items, with an optional title */
function Group({ name, children }: SettingsMenuGroupProps) {
  const { tc } = useTranslation();
  return (
    <div className="SettingsMenu__group">
      {name && (
        <div className="SettingsMenu__group__name group-title">
          <span>{tc(name)}</span>
        </div>
      )}
      {children}
    </div>
  );
}

/** The item goes to a page of the app */
export type SettingsMenuPageItem = {
  /** The page of the app, for example "/project-settings/site" */
  to: string;
  /** The item is active only when the URL is exactly `to` */
  exact?: boolean;
  /**
   * Forces the active state, for a row that is also active on other paths.
   * Without it, the row is active when the URL matches `to`.
   */
  active?: boolean;
  href?: never;
  onClick?: never;
  newTab?: never;
};

/** The item goes to a page out of the app */
export type SettingsMenuLinkItem = {
  /** The address of the page, for example "https://www.datocms.com" */
  href: string;
  /** Opens the page in a new tab. The item shows an icon for it. */
  newTab?: boolean;
  to?: never;
  exact?: never;
  active?: never;
  onClick?: never;
};

/** The item runs an action */
export type SettingsMenuActionItem = {
  /** Runs when the user picks the item */
  onClick: () => void;
  /** The action opens a new tab. The item shows an icon for it. */
  newTab?: boolean;
  to?: never;
  exact?: never;
  active?: never;
  href?: never;
};

/** Where the item goes: a page of the app, a page out of the app, or an action */
export type SettingsMenuItemDestination =
  | SettingsMenuPageItem
  | SettingsMenuLinkItem
  | SettingsMenuActionItem;

export type SettingsMenuItemProps = SettingsMenuItemDestination & {
  /** An icon before the label */
  icon?: ReactNode;
  /** The name of the section, for example "Billing" */
  label: Message;
  /** Shows a warning dot at the end of the row */
  attention?: boolean;
};

/** A section of the settings area */
function Item(props: SettingsMenuItemProps) {
  const { t } = useTranslation();
  const { icon, label, attention, newTab } = props;

  const destination =
    props.to !== undefined
      ? { to: props.to, exact: props.exact, active: props.active }
      : props.href !== undefined
        ? { href: props.href, newTab }
        : { onClick: props.onClick };

  return (
    <SidebarTree.Node
      {...destination}
      icon={icon}
      label={label}
      trailing={
        attention ? (
          <span
            className="SettingsMenu__end"
            role="img"
            aria-label={t('settingsMenu.needsAttention')}
          >
            <FeedbackDot tone="warning" />
          </span>
        ) : newTab ? (
          <span
            className="SettingsMenu__end SettingsMenu__end--new-tab"
            role="img"
            aria-label={t('settingsMenu.opensNewTab')}
          >
            <Generic.OpenInNewTabIcon />
          </span>
        ) : undefined
      }
    />
  );
}

/** The notice opens a page of the app */
export type SettingsMenuNoticePageLink = {
  /** The page of the app, for example "/project-settings" */
  to: string;
  href?: never;
  newTab?: never;
};

/** The notice opens a page out of the app */
export type SettingsMenuNoticeExternalLink = {
  /** The address of the page, for example "https://www.datocms.com" */
  href: string;
  /** Opens the page in a new tab */
  newTab?: boolean;
  to?: never;
};

export type SettingsMenuNoticeProps = (
  | SettingsMenuNoticePageLink
  | SettingsMenuNoticeExternalLink
) & {
  /** An icon before the text */
  icon: ReactNode;
  /** The text, for example "Anything missing? Go to the other settings." */
  children: ReactNode;
};

/**
 * A link for the footer of the menu. All the box is the link, thus do not
 * put other links in the text.
 */
function Notice(props: SettingsMenuNoticeProps) {
  const { icon, children } = props;
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (props.to !== undefined) {
    return (
      <Link className="SettingsMenu__notice" to={props.to}>
        {content}
      </Link>
    );
  }

  return (
    <a
      className="SettingsMenu__notice"
      href={props.href}
      target={props.newTab ? '_blank' : undefined}
      rel={props.newTab ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
}

export default Object.assign(SettingsMenu, { Group, Item, Notice });
