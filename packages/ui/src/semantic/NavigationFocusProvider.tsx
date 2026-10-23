import React, {
  createContext,
  type MutableRefObject,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

type NavigationFocus = {
  pathname: string;
  /** The last pathname that a `Main` gave the focus to */
  consumed: MutableRefObject<string>;
};

const NavigationFocusContext = createContext<NavigationFocus | null>(null);

export type NavigationFocusProviderProps = {
  /** The pathname of the current location. A change moves the focus. */
  pathname: string;
  children?: ReactNode;
};

/**
 * Moves the focus into the `Main` of the new page when the pathname changes
 * (WCAG 2.1 AA 2.4.3). Without it, the focus stays on the element that
 * started the navigation, or goes back to the trigger of a closed dialog.
 * The keys then run the actions of the old place. The host mounts it around
 * its routes. The first pathname does not move the focus. A change of the
 * query string does not move it: a filter field writes to the query string.
 */
export function NavigationFocusProvider({
  pathname,
  children,
}: NavigationFocusProviderProps) {
  const consumed = useRef(pathname);
  const value = useMemo(() => ({ pathname, consumed }), [pathname]);

  return (
    <NavigationFocusContext.Provider value={value}>
      {children}
    </NavigationFocusContext.Provider>
  );
}

export function useNavigationFocus() {
  return useContext(NavigationFocusContext);
}
