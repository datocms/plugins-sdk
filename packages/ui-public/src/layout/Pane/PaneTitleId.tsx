import { createContext, useContext } from 'react';

const PaneTitleIdContext = createContext<string | undefined>(undefined);

// The Pane gives the id to the title in its header slot. The content of the
// pane uses the id as its label while the pane is in a mode, and a NavList in
// the pane uses it as its label.
export const PaneTitleIdProvider = PaneTitleIdContext.Provider;

export function usePaneTitleId() {
  return useContext(PaneTitleIdContext);
}
