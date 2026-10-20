import { SyntheticEvent } from 'react';

export type DropdownTriggerBaseProps = {
  /** The menu is open. Dropdown gives it. */
  open: boolean;
  /** Opens or closes the menu. Dropdown gives it. */
  onTrigger: (event: SyntheticEvent) => void;
};
