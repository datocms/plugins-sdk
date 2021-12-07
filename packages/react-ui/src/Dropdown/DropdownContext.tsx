import { createContext } from 'react';

type DropdownContextType = {
  closeMenu: () => void;
};

export const DropdownContext = createContext<DropdownContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  closeMenu: () => {},
});
