import React, { type SyntheticEvent } from 'react';
import DropdownTriggerButton from '../../actions/Dropdown/triggers/DropdownTriggerButton';
import { useTranslation } from '../../i18n';
import type { Message } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';

export type InfoListValueProps = {
  /** The value, for example the file name of an asset */
  label: Message;
};

export type InfoListValueTriggerProps = {
  /** The value, for example the collection of an asset */
  label: Message;
  /** The menu is open. Dropdown gives it. */
  open: boolean;
  /** Opens or closes the menu. Dropdown gives it. */
  onTrigger: (event: SyntheticEvent) => void;
};

/**
 * A value in a row of an InfoList, that the user cannot change. It has the
 * same look as `InfoList.Value.Trigger`, thus the values of the rows align.
 */
function Value({ label }: InfoListValueProps) {
  const { tc } = useTranslation();

  return (
    <div className="InfoList__value">
      <span className="InfoList__value__label">{tc(label)}</span>
    </div>
  );
}

/**
 * A value in a row of an InfoList that opens a menu or a small form: the
 * trigger of a Dropdown. Give it to `triggerComponent` of `Dropdown`.
 */
function ValueTrigger({ label, open, onTrigger }: InfoListValueTriggerProps) {
  const { tc } = useTranslation();

  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className="InfoList__value is-editable button--ghost-inline"
    >
      <span className="InfoList__value__label">{tc(label)}</span>
      <MenuChevron />
    </DropdownTriggerButton>
  );
}

export default Object.assign(React.memo(Value), {
  Trigger: React.memo(ValueTrigger),
});
