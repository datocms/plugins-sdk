import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { UI } from '../../icons/index';
import Button from '../actions/Button';
import { Dropdown } from '../actions/Dropdown';
import ButtonTrigger from '../actions/Dropdown/triggers/ButtonTrigger';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import Heading, { HeadingLevel } from '../semantic/Heading';
import Spinner from './Spinner';

export type BlankSlateDocsLink = {
  /**
   * The label shows only when there are more links: in the menu of the
   * "Documentation" button. Without it, the menu shows the URL.
   */
  label?: Message;
  href: string;
};

const docsLabel = { id: 'blankSlate.documentation' };

function openInNewTab(href: string) {
  window.open(href, '_blank', 'noopener,noreferrer');
}

const DocsButton = React.memo(function DocsButton({
  docs,
}: {
  docs: BlankSlateDocsLink[];
}) {
  const { tc } = useTranslation();
  if (docs.length === 1) {
    return (
      <Button
        size="small"
        newTab
        href={docs[0].href}
        icon={UI.BookIcon}
        label={docsLabel}
      />
    );
  }

  return (
    <Dropdown
      triggerComponent={ButtonTrigger}
      icon={UI.BookIcon}
      label={docsLabel}
    >
      <Dropdown.Menu placement="bottom-start">
        {docs.map((link) => (
          <Dropdown.Option
            key={link.href}
            onPick={() => openInNewTab(link.href)}
          >
            {link.label ? tc(link.label) : link.href}
          </Dropdown.Option>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
});

/**
 * While the content loads: a spinner shows in the place of the icon. The
 * title then tells what loads. Without a title, the spinner tells that the
 * content loads.
 */
type Loading = {
  /** Shows a spinner in the place of the icon */
  loading: true;
  /** What loads, for example "Loading the invoices" */
  title?: Message;
  /** The spinner takes the place of the icon */
  icon?: never;
  error?: never;
};

/** The content is ready: the blank slate tells why there is nothing to show */
type Loaded = {
  loading?: false;
  /**
   * The name of the section in an overview, else what is missing, for
   * example "No members yet"
   */
  title: Message;
  /**
   * The icon of the entity: the icon of the menu item of the section that
   * lists it. A search with no results uses the search icon, and an error
   * uses a status icon.
   */
  icon?: ReactNode;
  /** Shows the color of an error on the icon */
  error?: boolean;
};

type BlankSlateState = Loading | Loaded;

export type BlankSlateProps = {
  /**
   * The level of the title as a heading. Give it when the blank slate is
   * the content of a page, alone in <main>: its title is then the title of
   * the page, level 1. Without it, the title is not a heading (for example
   * the message of an empty list in a page that has a title).
   */
  titleLevel?: HeadingLevel;
  /**
   * A quiet monospace box under the title, for example the raw message of
   * an error. It shows as text, not as HTML.
   */
  code?: Message;
  /** What shows in this area, and how it gets there */
  description?: Message;
  /** A small line under the description, for example a counter */
  caption?: Message;
  /**
   * Links to the documentation. They show as a button after the text: a
   * menu when there is more than one link.
   */
  docs?: BlankSlateDocsLink[];
  /**
   * The buttons that show before the documentation button, for example the
   * button that creates the first item
   */
  actions?: ReactNode;
  /**
   * Where the blank slate is. `area`: it fills its positioned parent, which
   * has a height of its own (the content of a Pane, a SplitViewPane, an
   * overview), and stays in its center. `inline`: it is a block in the flow
   * and the only content of its box (a dialog body, a card, a frame).
   * `section`: it is a block in the flow with content above or below it (the
   * title of a section of a page or of a panel, a label of a form); a frame
   * like the one of an empty slot separates it from that content.
   */
  placement: 'area' | 'inline' | 'section';
  /** Use the small size in narrow areas (a sidebar) and in a section of a page */
  small?: boolean;
  /** A class for the outer element of the blank slate */
  className?: string;
  /**
   * Content under the description that is not text, for example a short
   * form
   */
  children?: ReactNode;
} & BlankSlateState;

function BlankSlate({
  icon,
  loading,
  error,
  title,
  titleLevel,
  code,
  description,
  caption,
  docs,
  actions,
  placement,
  small,
  className,
  children,
}: BlankSlateProps) {
  const { tc } = useTranslation();
  const hasDocs = docs && docs.length > 0;
  const onlyTitle =
    !code && !description && !caption && !children && !hasDocs && !actions;

  return (
    <div
      className={classNames(
        'blank-slate',
        `blank-slate--${placement}`,
        className,
        {
          'blank-slate--small': small,
          'blank-slate--centered': onlyTitle,
          'blank-slate--error': error,
        },
      )}
    >
      <div className="blank-slate__inner">
        {loading ? (
          <div className="blank-slate__icon blank-slate__spinner">
            {/* The title tells what loads */}
            <Spinner label={false} />
          </div>
        ) : (
          icon && (
            <div aria-hidden="true" className="blank-slate__icon">
              {icon}
            </div>
          )
        )}
        {title &&
          (titleLevel ? (
            <Heading level={titleLevel} className="blank-slate__title">
              {tc(title)}
            </Heading>
          ) : (
            <div className="blank-slate__title">{tc(title)}</div>
          ))}
        {code && <div className="blank-slate__code">{tc(code)}</div>}
        {description && (
          <div className="blank-slate__description">{tc(description)}</div>
        )}
        {caption && <div className="blank-slate__caption">{tc(caption)}</div>}
        {children && <div className="blank-slate__content">{children}</div>}
        {(actions || hasDocs) && (
          <div className="blank-slate__actions">
            {actions}
            {hasDocs && <DocsButton docs={docs} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(BlankSlate);
