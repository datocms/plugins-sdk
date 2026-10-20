import classNames from 'classnames';
import type { PillTone } from './Pill';

/**
 * The classes of a pill. Pill and Dropdown.PillTrigger use them: a trigger
 * must render DropdownTriggerButton, thus it cannot be a <Pill>. This module
 * is not in the exports of the package.
 */
export function pillClassName({
  tone = 'neutral',
  clickable = false,
  open = false,
}: {
  tone?: PillTone;
  clickable?: boolean;
  open?: boolean;
}) {
  return classNames('Pill', `Pill--${tone}`, {
    'Pill--clickable': clickable,
    'is-open': open,
  });
}
