import classNames from 'classnames';
import React, { ReactNode, useCallback } from 'react';
import { useAutoincrementIntegerId } from '../hooks/useAutoincrementIntegerId';
import { useRovingKeyDown } from '../hooks/useRovingKeyDown';
import { useTranslation } from '../i18n';
import ToolbarRoot from '../layout/Toolbar/Root';
import { type Message, type TextMessage } from '../Message';
import Nav from '../semantic/Nav';
import RawButton from '../semantic/RawButton';
import Link from './Link';
import { isActivePath, useNavigation } from './NavigationProvider';

/**
 * Gives the DOM ids that link the tabs to their panel. Give `tabId(key)` to
 * the `id` of a Toolbar.Tab and `panelId` to the panel (for example the
 * "tabPanel" prop of the Pane).
 */
export function useTabIds() {
  const uid = useAutoincrementIntegerId();

  const tabId = useCallback((key: string) => `Tabs-${uid}-tab-${key}`, [uid]);

  return { tabId, panelId: `Tabs-${uid}-panel` };
}

const TAB_SELECTOR = '[role="tab"]';

export type TabListProps = {
  /** The accessible name of the tablist, for example "Sidebar" */
  ariaLabel: TextMessage;
  /** The Toolbar.Tab elements */
  children: ReactNode;
};

/**
 * The WAI-ARIA tablist. The parent keeps the active tab in its state. The
 * arrow keys, Home and End move the focus and select the tab (automatic
 * activation). It is Toolbar.Tabs.
 */
export const TabList = React.memo(function TabList({
  ariaLabel,
  children,
}: TabListProps) {
  const { tm } = useTranslation();
  const handleKeyDown = useRovingKeyDown(TAB_SELECTOR);

  return (
    <div
      className="Toolbar__tabs"
      role="tablist"
      aria-label={tm(ariaLabel)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
});

export type TabButtonProps = {
  /** The DOM id of the tab. Use `tabId(key)` of useTabIds. */
  id: string;
  /** The DOM id of the panel that the tab shows. Use `panelId` of useTabIds. */
  panelId: string;
  /** The text of the tab, for example "Validations" */
  label: Message;
  /** True for the tab that shows */
  active: boolean;
  /** The tab has fields with errors. It shows an error mark. */
  invalid?: boolean;
  /** Runs when the user picks the tab (click, or arrow keys) */
  onPick: () => void;
};

/** A tab of a Toolbar.Tabs. It is Toolbar.Tab. */
export const TabButton = React.memo(function TabButton({
  id,
  panelId,
  label,
  active,
  invalid,
  onPick,
}: TabButtonProps) {
  const { tc } = useTranslation();
  return (
    <RawButton
      id={id}
      tab={{ selected: active, controls: active ? panelId : undefined }}
      tabIndex={active ? 0 : -1}
      className={classNames('Toolbar__tab', {
        'Toolbar__tab--active': active,
        'Tabs__tab--invalid': invalid && !active,
      })}
      onClick={onPick}
    >
      {tc(label)}
    </RawButton>
  );
});

export type TabLinkProps = {
  /**
   * The page of the tab: the path with its query, for example
   * "/schema/blog_post"
   */
  to: string;
  /** The text of the tab */
  label: Message;
  /**
   * Sets the active tab when the URL does not tell it, for example a tab in
   * the query of the URL. Without it, the tab is active when the URL matches
   * `to`.
   */
  active?: boolean;
  /** The tab has fields with errors. It shows an error mark. */
  invalid?: boolean;
  /** The link replaces the current entry of the history */
  replace?: boolean;
};

/**
 * A tab that is a link to a page, in a nav (Pane.Header.Tabs).
 * It is Toolbar.TabLink.
 */
export const TabLink = React.memo(function TabLink({
  to,
  label,
  active,
  invalid,
  replace,
}: TabLinkProps) {
  const { tc } = useTranslation();
  const { location } = useNavigation();
  const isActive =
    active ?? (location ? isActivePath(location.pathname, to) : false);

  return (
    <Link
      to={to}
      replace={replace}
      active={isActive}
      className={classNames('Toolbar__tab', {
        'Toolbar__tab--active': isActive,
        'Tabs__tab--invalid': invalid && !active,
      })}
    >
      {tc(label)}
    </Link>
  );
});

/** One tab of Tabs: its handle in the row and its content */
export type TabsItem = {
  /** The key of the tab. It is the value of "?tab=" in the URL mode. */
  id: string;
  /** The text of the tab, for example `{ id: 'fieldForm.tabs.validations' }` */
  label: Message;
  /** The tab has fields with errors. It shows an error mark. */
  invalid?: boolean;
  /** The content of the tab. It renders only when the tab is active. */
  content: React.ReactNode;
};

/** Where the active tab is kept */
type TabsMode =
  /** URL mode: the query of the URL keeps the active tab */
  | {
      /**
       * The key of the query that keeps the active tab. Give a different
       * key to a second Tabs on the same page.
       * @default "tab"
       */
      urlParam?: string;
      activeTabId?: never;
      onChange?: never;
    }
  /** State mode: the parent keeps the active tab (for example in a dialog) */
  | {
      /** The `id` of the tab that shows */
      activeTabId: string;
      /** Runs when the user picks a tab */
      onChange: (tabId: string) => void;
      urlParam?: never;
    };

export type TabsProps = TabsMode & {
  /**
   * The tabs, in their order. A value that is `false`, `null` or
   * `undefined` shows no tab: use `condition && { … }`.
   */
  tabs: (TabsItem | false | null | undefined)[];
  /**
   * The accessible name of the tabs (the "aria-label" of the nav or of the
   * tablist), for example "Edit field"
   */
  ariaLabel: TextMessage;
  /** Shows at the end of the row of tabs, for example the ID of the record */
  extraInfo?: React.ReactNode;
  /**
   * Shows at the top of the content of each tab, for example the error of
   * the form (FormGlobalError)
   */
  beforeContent?: React.ReactNode;
};

/**
 * Tabs with their content. The tabs have two modes:
 *
 * - The URL keeps the tab ("?tab=..."). Each tab is a link, and the row of
 *   tabs is a nav. The active link has aria-current="page". The browser can
 *   open a tab in a new window, and the URL gives the same tab again.
 * - The parent keeps the tab (`activeTabId` and `onChange`). This is the
 *   WAI-ARIA tabs pattern: a tablist of tab buttons and one tabpanel.
 */
export function Tabs({
  tabs: maybeTabs,
  ariaLabel,
  extraInfo,
  activeTabId: controlledTabId,
  onChange,
  urlParam = 'tab',
  beforeContent,
}: TabsProps) {
  const { tm } = useTranslation();
  const labelText = tm(ariaLabel);
  const { location } = useNavigation();
  const search = location?.search ?? '';
  const { tabId, panelId } = useTabIds();
  const isControlled = onChange !== undefined;

  const tabs = maybeTabs.filter((tab): tab is TabsItem => Boolean(tab));
  const firstTabId = tabs[0]?.id;

  const urlTabId = new URLSearchParams(search).get(urlParam) || undefined;
  const selectedTabId = isControlled ? controlledTabId : urlTabId;
  const activeTab =
    tabs.find((tab) => tab.id === selectedTabId) ?? tabs[0] ?? undefined;

  const urlForTab = (id: string) => {
    const params = new URLSearchParams(search);
    if (id === firstTabId) {
      params.delete(urlParam);
    } else {
      params.set(urlParam, id);
    }
    const query = params.toString();
    const pathname = location?.pathname ?? '';
    return query ? `${pathname}?${query}` : pathname;
  };

  const handles = tabs.map((tab) =>
    isControlled ? (
      <TabButton
        key={tab.id}
        id={tabId(tab.id)}
        panelId={panelId}
        label={tab.label}
        active={tab === activeTab}
        invalid={tab.invalid}
        onPick={() => onChange?.(tab.id)}
      />
    ) : (
      <TabLink
        key={tab.id}
        replace={true}
        to={urlForTab(tab.id)}
        label={tab.label}
        active={tab === activeTab}
        invalid={tab.invalid}
      />
    ),
  );

  return (
    <div className="Tabs">
      <ToolbarRoot borderBottom={true} className="Tabs__handles">
        {isControlled ? (
          <TabList ariaLabel={labelText}>{handles}</TabList>
        ) : (
          <Nav className="Toolbar__tabs" ariaLabel={labelText}>
            {handles}
          </Nav>
        )}
        {extraInfo && <div className="Tabs__extra-info">{extraInfo}</div>}
      </ToolbarRoot>
      {activeTab &&
        (isControlled ? (
          <div
            className="Tabs__content"
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(activeTab.id)}
          >
            {beforeContent}
            {activeTab.content}
          </div>
        ) : (
          <div className="Tabs__content">
            {beforeContent}
            {activeTab.content}
          </div>
        ))}
    </div>
  );
}
