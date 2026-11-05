import {
  type Delay,
  type FloatingRootContext,
  NextFloatingDelayGroup,
  useNextDelayGroup,
} from '@floating-ui/react';
import React, { type ReactNode } from 'react';

// After an overlay of the group closes, the next overlay opens immediately
// until the pointer is out of the triggers for this time.
const GROUP_TIMEOUT_MS = 300;

// The delay of the group when no overlay is open. It is only a marker: an
// overlay then uses its own delay (see useHoverDelay).
const IDLE_DELAY = { open: 0, close: 0 };

/**
 * The tooltips and the hover cards in this group open one at a time. When
 * the next one opens, the one before it closes. After the first one opens,
 * the next tooltip opens immediately. Put it once around the app.
 */
export function HoverDelayGroup({ children }: { children: ReactNode }) {
  return (
    <NextFloatingDelayGroup delay={IDLE_DELAY} timeoutMs={GROUP_TIMEOUT_MS}>
      {children}
    </NextFloatingDelayGroup>
  );
}

/**
 * Puts an overlay in the HoverDelayGroup. Give `delay` to `useHover`. When
 * no overlay of the group is open, or with no group, the overlay uses its
 * own delay. `isInstantPhase` is true when the overlay opened immediately
 * after another overlay of the group.
 *
 * Set `instant` to false for an overlay that the pointer can move into
 * (a hover card). The overlay then always waits for its own delay. If it
 * opens immediately, a trigger on the path from an open card to that card
 * opens its own card and closes the open card.
 */
export function useHoverDelay(
  context: FloatingRootContext,
  {
    enabled,
    delay,
    instant = true,
  }: { enabled: boolean; delay: Delay; instant?: boolean },
) {
  const { delayRef, hasProvider, isInstantPhase } = useNextDelayGroup(context, {
    enabled,
  });

  return {
    delay: () =>
      instant && hasProvider && delayRef.current !== IDLE_DELAY
        ? delayRef.current
        : delay,
    isInstantPhase,
  };
}
