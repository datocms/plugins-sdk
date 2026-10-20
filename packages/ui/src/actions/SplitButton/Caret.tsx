import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';
import { ButtonSize, ButtonTone, buttonClassName } from '../Button';
import DropdownTriggerButton from '../Dropdown/triggers/DropdownTriggerButton';
import { DropdownTriggerBaseProps } from '../Dropdown/triggers/types';
import { type Disabled } from '../disabledReason';

export type CaretProps = DropdownTriggerBaseProps & {
  tone: Extract<ButtonTone, 'primary' | 'soft'>;
  size: ButtonSize;
  ariaLabel: TextMessage;
  disabled?: Disabled;
};

/**
 * The caret half of a SplitButton. It has the tone and the size of the main
 * half, thus the two halves read as one button.
 */
const Caret = React.memo(function Caret({
  open,
  onTrigger,
  tone,
  size,
  ariaLabel,
  disabled,
}: CaretProps) {
  const { tm } = useTranslation();

  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      disabled={disabled}
      aria-label={tm(ariaLabel)}
      className={classNames(
        buttonClassName({ tone, size, iconOnly: true }),
        'button--split-caret button--sub',
      )}
    >
      <MenuChevron />
    </DropdownTriggerButton>
  );
});

export default Caret;
