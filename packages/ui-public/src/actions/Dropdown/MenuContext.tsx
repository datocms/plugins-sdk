import { createContext, SyntheticEvent, useContext } from 'react';

type Context = {
  searchTerm: string;
  addOption: (id: string) => void;
  setClickHandlerForOption: (
    id: string,
    handler: (e: SyntheticEvent) => void,
  ) => void;
};

const MenuContext = createContext<Context>({
  searchTerm: '',
  addOption: () => {},
  setClickHandlerForOption: () => {},
});

export default MenuContext;

// The text in the search field of the menu. A child of a Menu uses it to
// choose the options to render (for example, a short list while the field
// is empty).
export function useMenuSearchTerm() {
  return useContext(MenuContext).searchTerm;
}
