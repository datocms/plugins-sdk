import React, { createContext, ReactNode, useContext } from 'react';

type ListDetailWidths = {
  // The width of the list in pixels after the user resized it, or undefined
  // before
  listWidth: number | undefined;
  onListWidthChange: (width: number) => void;
  // The width of the detail in pixels after the user resized it (with the
  // sash on its right border), or undefined before
  detailWidth: number | undefined;
  onDetailWidthChange: (width: number) => void;
};

const noop = () => {};

const ListDetailWidthsContext = createContext<ListDetailWidths>({
  listWidth: undefined,
  onListWidthChange: noop,
  detailWidth: undefined,
  onDetailWidthChange: noop,
});

// The app keeps the widths of the list and of the detail, and gives them
// once, near the root. Thus all the lists with a detail of the app share
// them. Without the provider, the split uses its default widths and does
// not keep a resize.
export function ListDetailWidthsProvider({
  value,
  children,
}: {
  value: ListDetailWidths;
  children: ReactNode;
}) {
  return (
    <ListDetailWidthsContext.Provider value={value}>
      {children}
    </ListDetailWidthsContext.Provider>
  );
}

export function useListDetailWidths() {
  return useContext(ListDetailWidthsContext);
}
