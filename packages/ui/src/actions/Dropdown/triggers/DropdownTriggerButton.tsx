import React, { ButtonHTMLAttributes, MouseEvent, useContext } from 'react';
import RawButton from '../../../semantic/RawButton';
import {
  type Disabled,
  DisabledReasonTooltip,
  disabledReasonOf,
} from '../../disabledReason';
import DropdownContext from '../DropdownContext';
import { handleDropdownTriggerKeyDown } from './handleDropdownTriggerKeyDown';
import { DropdownTriggerBaseProps } from './types';

export type DropdownTriggerButtonProps = DropdownTriggerBaseProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | 'type'
    | 'id'
    | 'onMouseDown'
    | 'onClick'
    | 'onKeyDown'
    | 'aria-haspopup'
    | 'aria-expanded'
    | 'aria-controls'
    | 'disabled'
  > & {
    /**
     * The menu cannot open. With a reason, the button keeps the focus and
     * its tooltip tells why.
     */
    disabled?: Disabled;
  };

// The menu opens on mouse down, thus the click must not submit a form or
// reach the parents.
function stopClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * The button of every trigger of a Dropdown. It connects the button to the
 * menu (id, events and ARIA attributes). The trigger gives the look with
 * className and children. Other props (aria-label, the props of a Tooltip)
 * go to the button. Use it only to make a new trigger.
 */
const DropdownTriggerButton = React.forwardRef<
  HTMLButtonElement,
  DropdownTriggerButtonProps
>(function DropdownTriggerButton(
  { open, onTrigger, disabled, children, ...rest },
  ref,
) {
  const { triggerId, menuId } = useContext(DropdownContext);
  const hasReason = disabledReasonOf(disabled) !== undefined;

  return (
    <DisabledReasonTooltip disabled={disabled}>
      <RawButton
        {...rest}
        ref={ref}
        id={triggerId}
        disabled={hasReason ? 'focusable' : Boolean(disabled)}
        onMouseDown={disabled ? undefined : onTrigger}
        onClick={stopClick}
        onKeyDown={
          disabled
            ? undefined
            : (event) => handleDropdownTriggerKeyDown(event, onTrigger, open)
        }
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
      >
        {children}
      </RawButton>
    </DisabledReasonTooltip>
  );
});

export default React.memo(DropdownTriggerButton);
