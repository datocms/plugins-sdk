import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

// The scroll containers that have auto-scroll at this moment, with the
// number of drags that use each of them
const registrations = new Map<Element, { count: number; cleanup: CleanupFn }>();

let windowRegistration: { count: number; cleanup: CleanupFn } | null = null;

function isScrollable(element: Element) {
  const { overflowX, overflowY } = getComputedStyle(element);

  return [overflowX, overflowY].some(
    (overflow) => overflow === 'auto' || overflow === 'scroll',
  );
}

function scrollContainersOf(element: HTMLElement): Element[] {
  const result: Element[] = [];
  let current = element.parentElement;

  while (current && current !== document.body) {
    if (isScrollable(current)) {
      result.push(current);
    }

    current = current.parentElement;
  }

  return result;
}

// Call enableAutoScrollAround when a drag starts: the auto-scroll library
// reads its registry at each frame, thus a late registration works. The
// cleanup function removes the registrations of this drag only.
export function enableAutoScrollAround(element: HTMLElement): CleanupFn {
  const containers = scrollContainersOf(element);

  for (const container of containers) {
    const existing = registrations.get(container);

    if (existing) {
      existing.count += 1;
    } else {
      registrations.set(container, {
        count: 1,
        cleanup: autoScrollForElements({ element: container }),
      });
    }
  }

  if (windowRegistration) {
    windowRegistration.count += 1;
  } else {
    windowRegistration = {
      count: 1,
      cleanup: autoScrollWindowForElements(),
    };
  }

  return () => {
    for (const container of containers) {
      const existing = registrations.get(container);

      if (!existing) {
        continue;
      }

      existing.count -= 1;

      if (existing.count === 0) {
        existing.cleanup();
        registrations.delete(container);
      }
    }

    if (windowRegistration) {
      windowRegistration.count -= 1;

      if (windowRegistration.count === 0) {
        windowRegistration.cleanup();
        windowRegistration = null;
      }
    }
  };
}
