import { createContext, type RefObject } from 'react';

const DropdownContext = createContext({
  closeMenu: () => {},
  setCloseOnClickOutside: (_value: boolean) => {},
  // True during the exit animation, after the menu closes and before React
  // removes it
  isClosing: false,
  triggerId: undefined as string | undefined,
  menuId: undefined as string | undefined,
  // The element of the dropdown in the page, around the trigger. The menu
  // is in a portal, out of it.
  rootRef: { current: null } as RefObject<HTMLElement | null>,
});

export default DropdownContext;
