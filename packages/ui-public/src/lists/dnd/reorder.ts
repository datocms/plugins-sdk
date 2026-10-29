import type { SortableDropResult } from './SortableList';

/**
 * Gives a copy of the list with the dropped item at its new index. Use it in
 * the `onDrop` of a SortableList with one container. Without a drop result,
 * it gives the same list.
 */
export function reorder<T>(
  list: T[],
  dropResult: SortableDropResult | null | undefined,
): T[] {
  if (!dropResult) {
    return list;
  }

  const {
    source: { index: startIndex },
    destination: { index: endIndex },
  } = dropResult;

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
