import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../../../i18n';
import { type Message } from '../../../Message';
import { MenuChevron } from '../../../navigation/Chevron';
import { SvgIcon } from '../../../utils/types';
import DropdownTriggerButton from './DropdownTriggerButton';
import { DropdownTriggerBaseProps } from './types';

export type TextualTriggerProps = DropdownTriggerBaseProps & {
  /** The icon before the label */
  icon?: SvgIcon;
  /** The text of the trigger */
  label?: Message;
};

/**
 * A value in a line of text that opens a menu to change it (an inline ghost
 * button with a chevron)
 */
const TextualTrigger = ({
  icon: Icon,
  label,
  open,
  onTrigger,
}: TextualTriggerProps) => {
  const { tc } = useTranslation();
  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className={classNames(
        'Dropdown__textual-trigger',
        'button--ghost-inline',
        {
          'Dropdown__textual-trigger--open': open,
        },
      )}
    >
      {Icon && <Icon />}
      {label ? <span>{tc(label)}</span> : null}
      <MenuChevron />
    </DropdownTriggerButton>
  );
};

export default TextualTrigger;
