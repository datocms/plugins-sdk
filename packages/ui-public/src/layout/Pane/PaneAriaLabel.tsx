import { createContext, useContext } from 'react';

const PaneAriaLabelContext = createContext('');

// A Pane always gives a value, also an empty one. A context crosses a portal,
// thus a dialog would read the label of the page below.
export const PaneAriaLabelProvider = PaneAriaLabelContext.Provider;

export function usePaneAriaLabel() {
  return useContext(PaneAriaLabelContext);
}
