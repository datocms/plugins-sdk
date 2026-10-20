import React from 'react';
import DropdownTriggerButton from '../../actions/Dropdown/triggers/DropdownTriggerButton';
import { DropdownTriggerBaseProps } from '../../actions/Dropdown/triggers/types';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';

export type ToolbarTitleTriggerProps = DropdownTriggerBaseProps & {
  /** The title of the toolbar */
  label: Message;
};

/**
 * The title of a toolbar that opens a menu. Use it only for a menu that
 * switches the view of the same list (see Toolbar.PresetsTitle), never for actions
 * on the thing that the title names. The chevron always shows, thus the
 * user sees that the title opens a menu.
 */
export default function ToolbarTitleTrigger({
  onTrigger,
  label,
  open,
}: ToolbarTitleTriggerProps) {
  const { tc } = useTranslation();
  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className="Toolbar__title--dropdown"
    >
      <span>{tc(label)}</span>
      <MenuChevron />
    </DropdownTriggerButton>
  );
}
