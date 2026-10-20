import React, { ReactNode } from 'react';
import { Dropdown } from '../../actions/Dropdown';
import Pill from '../../content/Pill';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';
import type { HeadingLevel } from '../../semantic/Heading';
import Title from './Title';
import ToolbarTitleTrigger from './ToolbarTitleTrigger';

export type PresetsTitleProps = {
  /** The title of the list */
  label: Message;
  /**
   * The short name of the active preset, after the title ("API tokens ·
   * Unused"). Give nothing when the list shows all the items.
   */
  qualifier?: Message;
  /** The options of the menu: PresetsTitle.Option elements */
  children: ReactNode;
  /**
   * The content at the bottom of the menu, after a separator. The title
   * opens a menu, thus a "?" button next to it is one control too many: put
   * the help of the page here (a Toolbar.HelpBody with "secondary").
   */
  footer?: ReactNode;
  /** The level of the title as a heading (see Toolbar.Title) */
  level?: HeadingLevel;
  /** The id of the heading, thus other elements can use it as their label */
  id?: string;
};

/**
 * A toolbar title that is the menu of the presets of a list (views of the
 * list: fixed filters with a name). It only draws the title and the menu:
 * the caller gives the options and keeps the active preset. In a Pane,
 * Pane.Header.Title does this (see useFilteredList in ui/Pane).
 */
const PresetsTitle = React.memo(function PresetsTitle({
  label,
  qualifier,
  children,
  footer,
  level,
  id,
}: PresetsTitleProps) {
  const { tc } = useTranslation();
  return (
    <Title level={level} id={id}>
      <Dropdown
        className="ListPresets__dropdown"
        triggerComponent={ToolbarTitleTrigger}
        label={
          <>
            {tc(label)}
            {qualifier && (
              <span className="ListPresets__qualifier">
                {' · '}
                {tc(qualifier)}
              </span>
            )}
          </>
        }
      >
        {() => (
          <Dropdown.Menu
            placement="bottom-start"
            // The text of the help needs a width to be readable
            minWidth={footer ? 360 : undefined}
          >
            {children}
            {footer && (
              <>
                <Dropdown.Separator />
                {footer}
              </>
            )}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </Title>
  );
});

export type PresetsTitleOptionProps = {
  /** The name of the preset: it tells exactly what the preset keeps */
  children: ReactNode;
  /** The number of the items that the preset keeps */
  count?: number;
  /** The preset is the active one */
  active: boolean;
  /** Runs when the user picks the preset */
  onPick: () => void;
};

/** One preset in the menu of a PresetsTitle, with the count of its items */
const PresetsTitleOption = React.memo(function PresetsTitleOption({
  children,
  count,
  active,
  onPick,
}: PresetsTitleOptionProps) {
  return (
    <Dropdown.Option active={active} onPick={onPick}>
      {count === undefined ? (
        children
      ) : (
        <span className="ListPresets__option">
          <span>{children}</span>
          <Pill>{count}</Pill>
        </span>
      )}
    </Dropdown.Option>
  );
});

export default Object.assign(PresetsTitle, { Option: PresetsTitleOption });
