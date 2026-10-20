import type { ReactElement } from 'react';

/**
 * A translation key with its values, for example `{ id: 'button.save' }`.
 * The texts adapter of the host gives the text of the key: the resources of
 * i18next in the apps, the texts of ui and the `texts` map in
 * `BundledTexts`. See the "Texts provider" docs page.
 */
export type IntlMessage = { id: string; values?: Record<string, any> };

/** A text with HTML markup. The component removes the unsafe parts. */
export type HtmlMessage = { html: string };

/**
 * A text that a component shows: a plain string, a translation key with its
 * values (for example `{ id: 'transferSite.success' }`), HTML (`{ html }`), or
 * a React element. A plain string is never parsed as HTML: it is safe for a
 * text from the user or from the server.
 */
export type Message = string | ReactElement | IntlMessage | HtmlMessage;

/**
 * A text that goes in an attribute (for example `aria-label`), thus it cannot
 * be a React element or HTML.
 */
export type TextMessage = string | IntlMessage;

export function isIntlMessage(obj: unknown): obj is IntlMessage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as IntlMessage).id === 'string'
  );
}

export function isHtmlMessage(obj: unknown): obj is HtmlMessage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as HtmlMessage).html === 'string'
  );
}
