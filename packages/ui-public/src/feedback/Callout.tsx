import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Generic, Status, UI } from '../../icons/index';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';

export type CalloutProps = {
  /**
   * "neutral" gives information. "warning" tells about a problem or a risk
   * with the current data, for example a token that shows only once.
   * "danger" tells about an error, for example the error of a form.
   * "success" tells that the current data is in a good state, for example
   * a usage that is within the limits.
   *
   * When a "warning" or "danger" callout appears, screen readers read it
   * immediately (role "alert"). They read a "success" callout when they are
   * not busy (role "status").
   * @default "neutral"
   */
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  /** Replaces the icon of the tone. Keep the meaning of the tone. */
  icon?: ReactNode;
  /** A short line in bold above the text, for example "Some invoices are due" */
  title?: Message;
  /** Only for the place of the callout (margin), not for its look */
  className?: string;
  /** The message. A next step is a link in the text. */
  children?: ReactNode;
};

/**
 * A message about the current data. For the text that tells what a page is
 * for, use Toolbar.Help. A callout has no buttons: a next step is a link in
 * the text, and a link only opens a page. An action that fixes the problem
 * goes in the row of the value, or in a Page.Group with a tone (a callout in
 * its body, and the actions in its rows).
 */
function Callout({
  tone = 'neutral',
  icon,
  title,
  className,
  children,
}: CalloutProps) {
  const { tc } = useTranslation();
  return (
    <div
      className={classNames('Callout', `Callout--${tone}`, className)}
      role={
        tone === 'neutral' ? 'note' : tone === 'success' ? 'status' : 'alert'
      }
    >
      <div className="Callout__icon">
        {icon ??
          (tone === 'success' ? (
            <UI.CircleCheckIcon />
          ) : tone === 'warning' ? (
            <Status.TriangleExclamationIcon />
          ) : tone === 'danger' ? (
            <Status.CircleExclamationIcon />
          ) : (
            <Generic.InfoIcon />
          ))}
      </div>
      <div className="Callout__body">
        {title && <div className="Callout__title">{tc(title)}</div>}
        {children}
      </div>
    </div>
  );
}

export default React.memo(Callout);
