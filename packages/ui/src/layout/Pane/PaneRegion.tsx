import { createContext, type RefObject, useContext } from 'react';

const PaneRegionContext = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

// The Pane gives its element to its parts. An action of the pane (the
// filter of its list) is on only while the pointer or the focus is in the
// pane, thus two lists on one page do not share a key.
export const PaneRegionProvider = PaneRegionContext.Provider;

/**
 * The element of the Pane around the component, for `useRegisterActions`:
 * the actions are on while the pointer or the focus is in the pane.
 * `undefined` out of a Pane.
 */
export function usePaneRegion() {
  return useContext(PaneRegionContext);
}

const CollectionRegionContext = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

// A list at the side of a detail or of a form (the list of a SplitPane or of
// a ListDetail.Split) gives the filter keys of the list to all the split.
// Thus a key over the detail or over a blank slate filters the list. A
// nested split or Pane is an inner region, thus it keeps its own keys.
export const CollectionRegionProvider = CollectionRegionContext.Provider;

/**
 * The element of the split around the list of the component, for the keys
 * that filter the list. `undefined` out of the list of a split.
 */
export function useCollectionRegion() {
  return useContext(CollectionRegionContext);
}
