import { createContext, SyntheticEvent } from 'react';

type Context = {
  searchTerm: string;
  addOption: (id: string) => void;
  setClickHandlerForOption: (
    id: string,
    handler: (e: SyntheticEvent) => void,
  ) => void;
};

export const MenuContext = createContext<Context>({
  searchTerm: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addOption: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setClickHandlerForOption: () => {},
});
