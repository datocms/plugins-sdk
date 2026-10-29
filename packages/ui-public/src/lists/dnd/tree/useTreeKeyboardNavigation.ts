import type React from 'react';
import { type MutableRefObject, useCallback } from 'react';
import type { FlattenedItem, ItemId } from './types';
import { hasChildren } from './utils';

const TREE_ITEM = '[data-tree-item]';

type Options = {
  rows: MutableRefObject<Map<ItemId, HTMLElement>>;
  flattenedItems: MutableRefObject<FlattenedItem[]>;
  onToggle: ((itemId: ItemId) => void) | undefined;
};

const KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

function getTreeItem(row: HTMLElement | undefined) {
  return row?.matches(TREE_ITEM)
    ? row
    : row?.querySelector<HTMLElement>(TREE_ITEM);
}

/**
 * Gives the keydown handler of a tree. The up and down arrows, Home and End
 * move the focus between the tree items. The right arrow opens a closed item,
 * or goes to its first child. The left arrow closes an open item, or goes to
 * its parent.
 */
export function useTreeKeyboardNavigation({
  rows,
  flattenedItems,
  onToggle,
}: Options) {
  return useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (
        !KEYS.has(event.key) ||
        !(event.target as HTMLElement).matches(TREE_ITEM) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const items = flattenedItems.current.filter(({ item }) =>
        getTreeItem(rows.current.get(item.id)),
      );
      const index = items.findIndex(
        ({ item }) => getTreeItem(rows.current.get(item.id)) === event.target,
      );

      if (index === -1) {
        return;
      }

      const { item, path } = items[index];
      let next: FlattenedItem | undefined;

      switch (event.key) {
        case 'ArrowDown':
          next = items[index + 1];
          break;
        case 'ArrowUp':
          next = items[index - 1];
          break;
        case 'Home':
          next = items[0];
          break;
        case 'End':
          next = items[items.length - 1];
          break;
        case 'ArrowRight':
          if (item.isExpanded && item.children.length > 0) {
            next = items[index + 1];
          } else if (hasChildren(item) && !item.isExpanded) {
            onToggle?.(item.id);
          }
          break;
        case 'ArrowLeft':
          if (hasChildren(item) && item.isExpanded) {
            onToggle?.(item.id);
          } else {
            next = items
              .slice(0, index)
              .reverse()
              .find((other) => other.path.length < path.length);
          }
          break;
      }

      event.preventDefault();

      if (next) {
        getTreeItem(rows.current.get(next.item.id))?.focus();
      }
    },
    [rows, flattenedItems, onToggle],
  );
}
