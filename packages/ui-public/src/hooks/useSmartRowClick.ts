import React, { useCallback, useLayoutEffect, useRef } from 'react';

// The elements that keep their own click. A click on one of them does not
// open the row.
const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, [role="button"]';

/**
 * Returns the `onClick` handler of a row that opens (or toggles) on a click.
 * The handler calls `handler` only for a "plain" click on the row. It ignores
 * these clicks:
 *
 * - A click on a node that is not in the row. A portal (for example a menu)
 *   sends its React events to the row, but its DOM nodes are not in the row.
 * - A click on an interactive child (a button, a link, a field). The child
 *   does its own action.
 * - A click that ends a text selection (for example, to copy a value).
 *
 * When `enabled` is false, the hook returns `undefined`, thus the row has no
 * click handler. The handler is stable: it always calls the latest `handler`.
 */
export function useSmartRowClick<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  enabled = true,
): React.MouseEventHandler<T> | undefined {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  const onClick = useCallback((event: React.MouseEvent<T>) => {
    const target = event.target as Element;

    if (
      !event.currentTarget.contains(target) ||
      target.closest(INTERACTIVE_SELECTOR) ||
      window.getSelection()?.toString()
    ) {
      return;
    }

    handlerRef.current();
  }, []);

  return enabled ? onClick : undefined;
}
