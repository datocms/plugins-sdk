import classNames from 'classnames';
import React from 'react';
import type { PillTone } from '../../../content/Pill';
import { pillClassName } from '../../../content/pillClassName';
import { useTranslation } from '../../../i18n';
import { type Message } from '../../../Message';
import { MenuChevron } from '../../../navigation/Chevron';
import DropdownTriggerButton from './DropdownTriggerButton';
import { DropdownTriggerBaseProps } from './types';

export type PillTriggerProps = DropdownTriggerBaseProps & {
  /** The value that shows in the pill */
  label: Message;
  /** The color of the pill (see Pill) */
  tone?: PillTone;
  /** An icon before the value, as the `icon` of Pill */
  icon?: React.ReactNode;
  /**
   * A class that changes the look of the pill in a context (for example
   * the target of a rule, with the shape of the verdict at its side)
   */
  triggerClassName?: string;
};

/** A Pill that opens a menu to change its value */
const PillTrigger = ({
  label,
  tone,
  icon,
  triggerClassName,
  open,
  onTrigger,
}: PillTriggerProps) => {
  const { tc } = useTranslation();
  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className={classNames(
        pillClassName({ tone, clickable: true, open }),
        triggerClassName,
      )}
    >
      {icon}
      <span>{tc(label)}</span>
      <MenuChevron />
    </DropdownTriggerButton>
  );
};

export default PillTrigger;
