import React, { ReactNode } from 'react';
import { useTranslation } from '../../i18n';
import type { Message } from '../../Message';
import { HeadingLevel } from '../../semantic/Heading';
import Toolbar from '../Toolbar';
import type { HelpProps } from '../Toolbar/Help';
import {
  ListFilterButton,
  ListFilterProps,
  ListFilterRow,
  useListFilter,
} from './ListFilter';
import type { ListPresetsProps } from './ListPresets';
import { usePaneTitleId } from './PaneTitleId';

// The title bar of a view pane: a pane to look at or browse (a list, a
// sidebar, a page to read, a side panel). Its parts change what the pane
// shows: the count, the filter, the presets, the tabs, the actions on the
// view and the button that adds an element. An edit pane (the form of one
// thing) uses Pane.FormHeader. The rules of this bar are here, thus all the
// panes have the same bar. The record editor and modals use Toolbar and its
// pieces directly.
//
// Rules:
// - Pane.Header renders the parts in a fixed order: title or tabs, subtitle,
//   menu, spinner, space, filter button, button. The order of the parts in the
//   JSX does not matter. Pane.Header picks the parts by type and renders them
//   in React, not with CSS `order`, thus the DOM order and the tab order are
//   the same as the visual order.
// - Title and Tabs exclude each other. A dev warning shows when a pane has
//   both or none.
// - Presets are only on Title. With presets, the help is in the presets menu.
// - The filter is a prop of Pane.Header. Pane.Header renders the filter button
//   in the bar and the filter row under the bar.
// - A part with no children (for example a menu with no options) does not show.
// - The parts must be direct children of Pane.Header. A fragment hides them.
//   Put a falsy value in place of a part that does not show.
//
// Put Pane.Header in the `header` slot of Pane.

export type PaneHeaderProps = {
  /**
   * The text filter of the list (the "filter" of useFilteredList). The
   * header shows the filter button in the bar and the filter row under it.
   */
  filter?: ListFilterProps;
  /** The parts: Pane.Header.Title or Pane.Header.Tabs, and the others */
  children: ReactNode;
};

export type PaneHeaderTitleProps = {
  /** The title */
  children: Message;
  /**
   * The level of the title as a heading. Give it only to a pane inside
   * <main> or inside a dialog that has content: the title of a detail pane
   * is level 2. Without it, the title is not a heading (for example the
   * title of a list at the left).
   */
  level?: HeadingLevel;
  /** The help of the page (a Toolbar.Help element) */
  help?: ReactNode;
  /**
   * Makes the title a menu of presets (views of the list: fixed filters
   * with a name), with the help at the bottom of the menu. The "presets" of
   * useFilteredList.
   * @see Toolbar.PresetsTitle
   */
  presets?: ListPresetsProps;
};

export type PaneHeaderTabsProps = {
  /** Toolbar.TabLink elements: each tab is a page with its own URL */
  children: ReactNode;
  /** The help of the page (a Toolbar.Help element). It shows after the tabs. */
  help?: ReactNode;
};

// The parts only carry their props. Pane.Header renders them.
function Title(_props: PaneHeaderTitleProps) {
  return null;
}

function Tabs(_props: PaneHeaderTabsProps) {
  return null;
}

function Subtitle(_props: { children: ReactNode }) {
  return null;
}

function Menu(_props: { children: ReactNode }) {
  return null;
}

// Shows a small spinner after the title and the menu while the list loads in
// the background (for example, a refresh at intervals)
function Spinner() {
  return null;
}

function Button(_props: { children: ReactNode }) {
  return null;
}

function findPart<P>(
  children: ReactNode,
  type: React.ComponentType<P>,
): React.ReactElement<P> | undefined {
  return React.Children.toArray(children).find(
    (child): child is React.ReactElement<P> =>
      React.isValidElement(child) && child.type === type,
  );
}

// The title as the menu of the presets. The help shows at the bottom of the
// menu, not as a "?" button.
function PresetsTitle({
  title,
  presets,
  id,
}: {
  id: string | undefined;
  title: PaneHeaderTitleProps;
  presets: ListPresetsProps;
}) {
  const { t, tc } = useTranslation();
  const active = presets.options.find((option) => option.id === presets.value);
  const help = React.isValidElement<HelpProps>(title.help)
    ? title.help.props
    : undefined;

  return (
    <Toolbar.PresetsTitle
      id={id}
      label={title.children}
      qualifier={active?.shortLabel}
      level={title.level}
      footer={
        help && (
          <Toolbar.HelpBody docsUrl={help.docsUrl} secondary>
            {help.children}
          </Toolbar.HelpBody>
        )
      }
    >
      <Toolbar.PresetsTitle.Option
        active={presets.value === null}
        onPick={() => presets.onChange(null)}
      >
        {t('admin.listPresets.all')}
      </Toolbar.PresetsTitle.Option>
      {presets.options.map((option) => (
        <Toolbar.PresetsTitle.Option
          key={option.id}
          count={option.count}
          active={presets.value === option.id}
          onPick={() => presets.onChange(option.id)}
        >
          {tc(option.label)}
        </Toolbar.PresetsTitle.Option>
      ))}
    </Toolbar.PresetsTitle>
  );
}

function PaneHeader({ filter, children }: PaneHeaderProps) {
  const { tc } = useTranslation();
  const listFilter = useListFilter(filter);
  const titleId = usePaneTitleId();

  const title = findPart(children, Title);
  const tabs = findPart(children, Tabs);
  const subtitle = findPart(children, Subtitle);
  const menu = findPart(children, Menu);
  const spinner = findPart(children, Spinner);
  const button = findPart(children, Button);

  if (import.meta.env.DEV) {
    if (Boolean(title) === Boolean(tabs)) {
      console.warn('PaneHeader needs exactly one of Title and Tabs');
    }
    if (tabs && title?.props.presets) {
      console.warn('PaneHeader: presets work only with Title');
    }
  }

  const presets = title?.props.presets;

  return (
    <>
      <Toolbar>
        {tabs ? (
          // The tabs fill the full height of the bar, thus they are not in a
          // group
          <>
            <div className="Toolbar__tabs">{tabs.props.children}</div>
            {tabs.props.help}
          </>
        ) : title ? (
          presets ? (
            <PresetsTitle id={titleId} title={title.props} presets={presets} />
          ) : (
            <Toolbar.Title
              id={titleId}
              level={title.props.level}
              help={title.props.help}
            >
              {tc(title.props.children)}
            </Toolbar.Title>
          )
        ) : null}
        {subtitle?.props.children && (
          <Toolbar.Subtitle>{subtitle.props.children}</Toolbar.Subtitle>
        )}
        {menu?.props.children && (
          <div className="Toolbar__title-menu">
            <Toolbar.DotsDropdown>{menu.props.children}</Toolbar.DotsDropdown>
          </div>
        )}
        <Toolbar.Spinner show={Boolean(spinner)} />
        <Toolbar.Space />
        {listFilter && (
          <ListFilterButton
            open={listFilter.open}
            onToggle={listFilter.onToggle}
          />
        )}
        {button?.props.children}
      </Toolbar>
      {listFilter?.open && (
        <ListFilterRow
          filter={listFilter.filter}
          onToggle={listFilter.onToggle}
          rowRef={listFilter.rowRef}
        />
      )}
    </>
  );
}

export default Object.assign(React.memo(PaneHeader), {
  Title,
  Tabs,
  Subtitle,
  Menu,
  Spinner,
  Button,
});
