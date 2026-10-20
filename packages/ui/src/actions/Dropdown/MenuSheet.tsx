import React, { createContext, ReactNode, useContext } from 'react';
import { useIsSmallViewport } from '../../hooks/useMediaQuery';

const MenuSheetContext = createContext(true);

export type MenuSheetProviderProps = {
  /** When false, a menu never opens as a sheet */
  enabled: boolean;
  /** The app */
  children: ReactNode;
};

/**
 * Turns on or off the sheet of the Dropdown menus below it. The `Canvas` of
 * react-ui turns it off: the viewport of a plugin is its frame, thus a
 * narrow frame on a large screen is not a phone. The apps give no provider.
 */
export function MenuSheetProvider({
  enabled,
  children,
}: MenuSheetProviderProps) {
  return (
    <MenuSheetContext.Provider value={enabled}>
      {children}
    </MenuSheetContext.Provider>
  );
}

/**
 * True when a Dropdown menu opens as a sheet: a centered panel over a
 * backdrop, with a Close option, for a small viewport.
 */
export function useIsMenuSheet() {
  const isSmallViewport = useIsSmallViewport();
  return useContext(MenuSheetContext) && isSmallViewport;
}
