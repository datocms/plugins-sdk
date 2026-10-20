import { createContext } from 'react';

const DropdownContext = createContext({
  closeMenu: () => {},
  setCloseOnClickOutside: (_value: boolean) => {},
  // True during the exit animation, after the menu closes and before React
  // removes it
  isClosing: false,
  triggerId: undefined as string | undefined,
  menuId: undefined as string | undefined,
});

export default DropdownContext;
