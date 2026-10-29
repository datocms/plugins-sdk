import type { Placement } from '@floating-ui/react';
import React from 'react';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import type { FloatingTrigger } from '../overlays/floatingTrigger';
import HoverCard from '../overlays/HoverCard';
import Tooltip from '../overlays/Tooltip';

/**
 * A disabled control that tells why. It keeps the focus and the hover
 * ("aria-disabled" in place of "disabled"), thus its tooltip shows the
 * reason, also to the keyboard and screen reader users.
 * With "interactive", the reason has links: it shows in a HoverCard, thus
 * the pointer can move into it.
 */
export type DisabledWithReason = { reason: Message; interactive?: boolean };

/** Give a reason when the user must know why the control is disabled */
export type Disabled = boolean | DisabledWithReason;

export function disabledReasonOf(
  disabled: Disabled | undefined,
): Message | undefined {
  return typeof disabled === 'object' ? disabled.reason : undefined;
}

/**
 * Shows the reason of a disabled control in a Tooltip, or in a HoverCard
 * when the reason is interactive. Without a reason, it renders the control
 * as it is.
 */
export function DisabledReasonTooltip({
  disabled,
  placement,
  children,
}: {
  disabled: Disabled | undefined;
  placement?: Placement;
  children: FloatingTrigger;
}) {
  const { tc } = useTranslation();

  if (typeof disabled !== 'object') {
    return children;
  }

  if (disabled.interactive) {
    return (
      <HoverCard
        content={<HoverCard.Body>{tc(disabled.reason)}</HoverCard.Body>}
        placement={placement}
      >
        {children}
      </HoverCard>
    );
  }

  return (
    <Tooltip label={disabled.reason} placement={placement}>
      {children}
    </Tooltip>
  );
}
