import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';

export function isAfterEdge(edge: Edge | null) {
  return edge === 'bottom' || edge === 'right';
}

// The drop line goes in the middle of this space, thus "after A" and
// "before B" are at the same place
export function getGapTo(
  element: Element,
  neighbour: Element | null | undefined,
  edge: Edge,
) {
  if (!neighbour) {
    return 0;
  }

  const own = element.getBoundingClientRect();
  const other = neighbour.getBoundingClientRect();
  const after = isAfterEdge(edge);

  const gap =
    edge === 'top' || edge === 'bottom'
      ? after
        ? other.top - own.bottom
        : own.top - other.bottom
      : after
        ? other.left - own.right
        : own.left - other.right;

  return Math.max(0, Math.round(gap));
}
