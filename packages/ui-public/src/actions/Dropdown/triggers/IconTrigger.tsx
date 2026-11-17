import React from 'react';
import { type TextMessage } from '../../../Message';
import { SvgIcon } from '../../../utils/types';
import { type ButtonSize, useButtonSize } from '../../Button';
import { type Disabled } from '../../disabledReason';
import ButtonTrigger from './ButtonTrigger';
import { DropdownTriggerBaseProps } from './types';

export type IconTriggerProps = DropdownTriggerBaseProps & {
  /** The icon. For a menu of actions, it is Generic.ActionToggleIcon (⋮). */
  icon: SvgIcon;
  /**
   * The accessible name of the button and the text of its tooltip. If you
   * do not give a label, the button gets the generic name "Actions" and no
   * tooltip, because "Actions" says nothing that the "⋮" does not say.
   */
  label?: TextMessage;
  /** The default size in a toolbar, "micro" outside a toolbar */
  size?: ButtonSize;
  /**
   * The menu cannot open. Give a reason when the user must know why. It
   * replaces the tooltip.
   */
  disabled?: Disabled;
  /**
   * Only for the position or the surface of the button (for example on a
   * media card)
   */
  className?: string;
};

/**
 * A ghost icon-only ButtonTrigger (the "⋮" of a row, a card or a toolbar).
 * It has the default size in a toolbar, and "micro" outside a toolbar
 * (the actions of a row or a card).
 */
const IconTrigger = ({
  icon,
  label,
  size,
  disabled,
  className,
  open,
  onTrigger,
}: IconTriggerProps) => {
  const placeSize = useButtonSize();

  return (
    <ButtonTrigger
      open={open}
      onTrigger={onTrigger}
      tone="ghost"
      size={size ?? (placeSize === 'small' ? 'micro' : placeSize)}
      iconOnly
      icon={icon}
      label={label ?? { id: 'sidebar.actions' }}
      tooltip={label ? undefined : false}
      disabled={disabled}
      className={className}
    />
  );
};

export default IconTrigger;
