import type { Placement } from '@floating-ui/react';
import React from 'react';
import { type Message } from '../../Message';
import type { FloatingTrigger } from '../../overlays/floatingTrigger';
import Tooltip from '../../overlays/Tooltip';
import { useAction } from './registry';

/**
 * A tooltip with the name and the keys of an action of the registry.
 * `label` takes the place of the name (the label of an icon-only button).
 * Without `label`, an action with no keys has no tooltip: the button already
 * shows its name.
 */
export function ActionTooltip({
  action: id,
  label,
  placement,
  hidden,
  children,
}: {
  action: string;
  label: Message | undefined;
  placement: Placement | undefined;
  /** The tooltip does not show, for example while a menu is open */
  hidden?: boolean;
  children: FloatingTrigger;
}) {
  const action = useAction(id);
  const shortcuts = action?.shortcuts ?? [];
  const hasKeys = shortcuts.length > 0;

  return (
    <Tooltip
      label={!hidden && (label ?? (hasKeys ? action?.name : undefined))}
      shortcut={hasKeys ? shortcuts : undefined}
      placement={placement}
    >
      {children}
    </Tooltip>
  );
}
