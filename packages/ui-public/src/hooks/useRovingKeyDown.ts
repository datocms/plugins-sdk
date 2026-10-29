import type React from 'react';
import { useCallback } from 'react';

/**
 * Gives the keydown handler of a group with a roving tabIndex (a tablist, a
 * radiogroup). Put it on the group element. The arrow keys, Home and End
 * move the focus to an item that matches `itemSelector` and click it. Only
 * the left and right arrows move the focus, unless `vertical` is true: then
 * the up and down arrows move it too.
 */
export function useRovingKeyDown(itemSelector: string, vertical = false) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;

      if (!target.matches(itemSelector)) {
        return;
      }

      const items = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>(itemSelector),
      );
      const currentIndex = items.indexOf(target);
      const next = (currentIndex + 1) % items.length;
      const previous = (currentIndex - 1 + items.length) % items.length;
      let nextIndex: number;

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = next;
          break;
        case 'ArrowLeft':
          nextIndex = previous;
          break;
        case 'ArrowDown':
          if (!vertical) return;
          nextIndex = next;
          break;
        case 'ArrowUp':
          if (!vertical) return;
          nextIndex = previous;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = items.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();

      const nextItem = items[nextIndex];
      const nextItemId = nextItem.id;
      nextItem.focus();
      nextItem.click();

      if (!nextItemId) {
        return;
      }

      // The parent can mount the items again when the selection changes (the
      // page of a record does). Then the focus goes back to the new element.
      requestAnimationFrame(() => {
        const item = document.getElementById(nextItemId);

        if (item && item !== document.activeElement) {
          item.focus();
        }
      });
    },
    [itemSelector, vertical],
  );
}
