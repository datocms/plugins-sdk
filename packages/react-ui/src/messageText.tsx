import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { isHtmlMessage, isIntlMessage, type Message } from 'ui-public/Message';
import { TextsProvider, useTexts } from 'ui-public/TextsProvider';

function htmlToText(html: string) {
  return (
    new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  );
}

/**
 * Gives a function that turns a `Message` into plain text. The host draws
 * the notifications and the dialogs of a plugin, and it takes only plain
 * text: thus the markup of a text goes away.
 */
export function useMessageText(): (message: Message) => string {
  const texts = useTexts();

  return useCallback(
    (message: Message) => {
      if (typeof message === 'string') {
        return message;
      }
      if (isIntlMessage(message)) {
        return htmlToText(texts.t(message.id, message.values));
      }
      if (isHtmlMessage(message)) {
        return htmlToText(message.html);
      }

      // An element (for example the texts of `confirmTexts`) can need the
      // texts of ui-public. Thus it renders in a detached root with the same texts,
      // and the text of the root is the result. flushSync cannot run during
      // a render: the services of the host run only in an event handler.
      const container = document.createElement('div');
      const root = createRoot(container);
      flushSync(() => {
        root.render(<TextsProvider value={texts}>{message}</TextsProvider>);
      });
      const text = container.textContent ?? '';
      root.unmount();
      return text;
    },
    [texts],
  );
}
