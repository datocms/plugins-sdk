import classNames from 'classnames';
import React, { type ReactNode, useMemo, useState } from 'react';
import Button, { type ButtonProps } from '../actions/Button';
import { useTranslation } from '../i18n';
import type { Message } from '../Message';
import { DisclosureChevron } from '../navigation/Chevron';
import Heading, { type HeadingLevel } from '../semantic/Heading';
import RawButton from '../semantic/RawButton';
import { type SvgIcon } from '../utils/types';

// React 17 has no `useId`, thus we make the ids of the contents with a counter.
let nextContentId = 0;

export type SidebarPanelCommonProps = {
  /** The title of the panel, for example `{ id: 'itemForm.links' }` */
  title: Message;
  /**
   * The level of the heading of the title, after the headings around the
   * panel. Give 2 when no level 2 heading is above the panel, for example in
   * the sidebar of a record.
   * @default 3
   */
  titleLevel?: HeadingLevel;
  /**
   * A number after the title, for example the number of links. The panel
   * does not show it when it is 0.
   */
  count?: number;
  /** The content of the panel, for example an InfoList */
  children: ReactNode;
  /**
   * The content goes from edge to edge and has no padding. Use it for content
   * with its own inset, for example a NavList.
   */
  flush?: boolean;
  /**
   * The content scrolls when it is taller than this height, in px, for
   * example 400
   */
  maxHeight?: number;
};

export type SidebarPanelCollapse = {
  /** True when the content shows */
  open: boolean;
  /** Called with the new state when the user clicks the title */
  onToggle: (open: boolean) => void;
};

/** The panel keeps its open state and forgets it on unmount. */
export type SidebarPanelUncontrolled = {
  /**
   * True when the panel is open at first
   * @default true
   */
  startOpen?: boolean;
  collapse?: never;
};

/**
 * The caller keeps the open state, for example with
 * `useLocalStorageSidebarPanelOpen`.
 */
export type SidebarPanelControlled = {
  /**
   * The open state and its setter. Give the pair of a storage hook:
   * `collapse={{ open, onToggle: setOpen }}`.
   */
  collapse: SidebarPanelCollapse;
  startOpen?: never;
};

export type SidebarPanelOpenMode =
  | SidebarPanelUncontrolled
  | SidebarPanelControlled;

export type SidebarPanelProps = SidebarPanelCommonProps & SidebarPanelOpenMode;

/**
 * A section of a sidebar or of a detail panel. The title is a heading with a
 * button in it, and the button opens and closes the content.
 */
function BaseSidebarPanel({
  startOpen = true,
  collapse,
  title,
  titleLevel = 3,
  count,
  children,
  flush,
  maxHeight,
}: SidebarPanelProps) {
  const { tc } = useTranslation();
  const [contentId] = useState(
    () => `SidebarPanel__content-${++nextContentId}`,
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(startOpen);
  const open = collapse ? collapse.open : uncontrolledOpen;
  const setOpen = collapse ? collapse.onToggle : setUncontrolledOpen;

  const contentStyle = useMemo(
    () => (maxHeight === undefined ? undefined : { maxHeight }),
    [maxHeight],
  );

  return (
    <div className="SidebarPanel">
      <Heading level={titleLevel}>
        <RawButton
          className="SidebarPanel__header"
          expandable={{ open, controls: contentId }}
          onClick={() => setOpen(!open)}
        >
          <span className="SidebarPanel__header__title">
            {tc(title)}
            {count !== undefined && count > 0 && (
              <span className="SidebarPanel__header__count">{count}</span>
            )}
          </span>
          <DisclosureChevron open={open} />
        </RawButton>
      </Heading>
      {open && (
        <div
          id={contentId}
          className={classNames(
            'SidebarPanel__content',
            flush && 'SidebarPanel__content--flush',
            maxHeight !== undefined && 'SidebarPanel__content--scrollable',
          )}
          style={contentStyle}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export type SidebarPanelBlankProps = {
  /** The text, for example `{ id: 'sidebar.noLinks' }` */
  message: Message;
};

/**
 * The text of a panel with nothing to show. In a `flush` panel, it keeps the
 * inset of the content.
 */
function Blank({ message }: SidebarPanelBlankProps) {
  const { tc } = useTranslation();

  return <div className="SidebarPanel__blank">{tc(message)}</div>;
}

export type SidebarPanelActionProps = {
  /** The text of the button, for example `{ id: 'newSchedule.title' }` */
  label: Message;
  /** The icon before the label */
  icon?: SvgIcon;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => unknown;
  /** Give a reason when the user must know why the action is disabled */
  disabled?: ButtonProps['disabled'];
};

/**
 * A small ghost button in the content of a panel, for example "New
 * schedule". Its text is in line with the content.
 */
function Action({ label, icon, onClick, disabled }: SidebarPanelActionProps) {
  return (
    <Button
      tone="ghost"
      size="micro"
      className="SidebarPanel__action"
      label={label}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

const SidebarPanel = Object.assign(BaseSidebarPanel, { Blank, Action });

export default SidebarPanel;

export {
  type SidebarPanelOpenStorage,
  useInMemorySidebarPanelOpen,
  useLocalStorageSidebarPanelOpen,
} from './sidebarPanelStorage';
