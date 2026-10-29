import classNames from 'classnames';
import React from 'react';
import { ButtonSizeContext } from '../../actions/Button';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';
import Heading, { type HeadingLevel } from '../../semantic/Heading';
import { type PageCollapse, PageCollapseToggle } from './PageSection';

export type PageGroupProps = {
  /** The title of the group, at the top left of the card */
  title: Message;
  /**
   * The level of the heading of the title. Give 3 for a group under a level
   * 2 heading.
   * @default 2
   */
  titleLevel?: HeadingLevel;
  /**
   * Buttons at the top right of the card. Use ghost or soft buttons. They get
   * the micro size: the header is a thin strip.
   */
  actions?: React.ReactNode;
  /**
   * A strip at the bottom of the card, for what belongs to the whole group
   * (a note, a link, details that open). Without it, the card has no strip.
   */
  footer?: React.ReactNode;
  /**
   * A colored border and a tint in the corner. `danger` (red) is for the
   * group of the destructive actions of a page (the "Danger zone") and for
   * a problem with the billing that the user must fix (for example "Action
   * required" when some invoices are due). `warning` (amber) is for other
   * problems that need an action of the user. Put the actions in the rows
   * of a SettingsList, not in a Callout.
   */
  tone?: 'danger' | 'warning';
  /**
   * A short status at the right of the title. Put a Pill here, in the color
   * of the tone (for example `<Pill tone="danger">Unpaid</Pill>`). Use it
   * for a problem that the user must fix, not for the "Danger zone". A group
   * without a tone can show its state (for example a `success` pill for a
   * step that is done in a wizard).
   */
  status?: React.ReactNode;
  /**
   * The body has no padding. Use it for a Table or a CardList: its rows go
   * from edge to edge of the card. Put the other parts of the body in a
   * Page.GroupInset.
   */
  flush?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /**
   * Only for a group that opens and closes. When the group is closed, it
   * shows only its header: the body and the footer do not show. Without
   * `onToggle`, the group cannot close (for example, it shows an error) and
   * the chevron is disabled.
   */
  collapse?: PageCollapse;
};

/**
 * A group of related content in a card, with its own title. Use it in a
 * Page.Content in place of a Page.Section when the content of the group has
 * more than one part (for example a summary and a chart), so the parts read
 * as one thing. The parts inside the card have no card of their own.
 */
export function PageGroup({
  title,
  titleLevel = 2,
  actions,
  footer,
  tone,
  status,
  flush,
  children,
  className,
  id,
  collapse,
}: PageGroupProps) {
  const { tc } = useTranslation();
  const open = collapse ? collapse.open : true;

  return (
    <div
      className={classNames(
        'Page__group',
        { [`Page__group--${tone}`]: tone },
        className,
      )}
      id={id}
    >
      <header className="Page__group__header">
        <Heading level={titleLevel} className="Page__group__title">
          {collapse ? (
            <PageCollapseToggle collapse={collapse}>
              {tc(title)}
            </PageCollapseToggle>
          ) : (
            tc(title)
          )}
        </Heading>
        {status}
        {actions && (
          <div className="Page__group__actions">
            <ButtonSizeContext.Provider value="micro">
              {actions}
            </ButtonSizeContext.Provider>
          </div>
        )}
      </header>
      {open && (
        <>
          <div
            className={classNames('Page__group__body', {
              'Page__group__body--flush': flush,
            })}
          >
            {children}
          </div>
          {footer && <footer className="Page__group__footer">{footer}</footer>}
        </>
      )}
    </div>
  );
}

export type PageGroupInsetProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * The padding of the body of a group, in a `flush` group. Use it for the
 * parts that are not from edge to edge of the card (for example a
 * SettingsList before a CardList).
 */
export function PageGroupInset({ children, className }: PageGroupInsetProps) {
  return (
    <div className={classNames('Page__group__inset', className)}>
      {children}
    </div>
  );
}
