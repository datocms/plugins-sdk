import React, { useContext } from 'react';
import { useTranslation } from '../../i18n';
import type { Message } from '../../Message';

export const FullscreenModalTitleContext = React.createContext<Message | null>(
  null,
);

/**
 * Gives the title of the FullscreenModal around the component, already
 * rendered, or null out of a FullscreenModal. A content that is also a page
 * (a record form, a list) shows it in its toolbar in place of the title of
 * the page.
 */
export function useFullscreenModalTitle(): React.ReactElement | null {
  const { tc } = useTranslation();
  const title = useContext(FullscreenModalTitleContext);

  // biome-ignore lint/complexity/noUselessFragments: the fragment makes a React element, thus a Message for Pane.Header.Title
  return title ? <>{tc(title)}</> : null;
}
