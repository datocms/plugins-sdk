import type { PointerEvent } from 'react';

// A gap keeps its height when it shows its button (see _InsertGap.css).
// Thus the content does not move and the positions that the script reads
// are stable.

// The value is in px. With this limit, no gap shows its button when the
// pointer is in the middle of a tall item. The CSS shows the buttons with
// NEAR_ATTRIBUTE.
export const NEAR_DISTANCE = 100;
export const NEAR_ATTRIBUTE = 'data-near';

// The lists with these handlers have this attribute (see RichContent). A
// list of a single block field has no handlers.
const LIST_SELECTOR = '[data-gap-list]';

const GAP_SELECTOR = '[data-gap]';

// The handlers are on each list. But only the outermost list of the field
// does the calculation, for all the gaps in it: one pass for each move of
// the pointer. The handlers change the DOM directly, so the lists do not
// render again each time that the pointer moves.

function isNested(list: HTMLElement) {
  return Boolean(list.parentElement?.closest(LIST_SELECTOR));
}

// The zone ends where the items adjacent to the gap end. Thus, in a list of
// short items, the pointer on an item shows only the two gaps adjacent to
// that item, not the gaps of the items around it.
function zoneOf(gap: HTMLElement) {
  const { top, bottom, height } = gap.getBoundingClientRect();

  // A gap in a closed block has no box
  if (height === 0) {
    return null;
  }

  // Only the last item has a gap below it, and that gap has no item below
  // it.
  const item = gap.parentElement;
  const itemRect = item?.getBoundingClientRect();
  const isAbove = itemRect ? top < itemRect.top : false;
  const itemAbove = isAbove ? item?.previousElementSibling : item;
  const itemBelow = isAbove ? item : null;

  return {
    top: Math.max(
      top - NEAR_DISTANCE,
      itemAbove?.getBoundingClientRect().top ?? Number.NEGATIVE_INFINITY,
    ),
    bottom: Math.min(
      bottom + NEAR_DISTANCE,
      itemBelow?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
    ),
  };
}

function update(root: HTMLElement, y: number) {
  const gaps = Array.from(root.querySelectorAll<HTMLElement>(GAP_SELECTOR));

  // Read all the positions first, then write, so the browser does the
  // layout only one time
  const states = gaps.map((gap) => {
    const zone = zoneOf(gap);

    return { gap, isNear: zone ? y >= zone.top && y <= zone.bottom : false };
  });

  for (const { gap, isNear } of states) {
    if (isNear !== gap.hasAttribute(NEAR_ATTRIBUTE)) {
      gap.toggleAttribute(NEAR_ATTRIBUTE, isNear);
    }
  }
}

function clear(root: HTMLElement) {
  root.querySelectorAll(`[${NEAR_ATTRIBUTE}]`).forEach((gap) => {
    gap.removeAttribute(NEAR_ATTRIBUTE);
  });
}

// The last position of the pointer in each field, until the next frame
const pendingY = new WeakMap<HTMLElement, number>();

export function handlePointerMoveList(event: PointerEvent<HTMLElement>) {
  // On touch devices the gaps always show their buttons (see the CSS)
  if (event.pointerType === 'touch') {
    return;
  }

  // The event goes up from a nested list to the outermost list. Only the
  // outermost list does the calculation.
  const root = event.currentTarget;

  if (isNested(root)) {
    return;
  }

  const isScheduled = pendingY.has(root);

  pendingY.set(root, event.clientY);

  if (isScheduled) {
    return;
  }

  requestAnimationFrame(() => {
    const y = pendingY.get(root);
    pendingY.delete(root);

    if (y !== undefined) {
      update(root, y);
    }
  });
}

export function handlePointerLeaveList(event: PointerEvent<HTMLElement>) {
  // When the pointer goes out of a nested list, it is still in the
  // outermost list, which sets the near gaps again
  const root = event.currentTarget;

  if (isNested(root)) {
    return;
  }

  pendingY.delete(root);
  clear(root);
}
