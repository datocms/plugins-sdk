import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from 'react';

/** A component that wraps the content of each Portal */
export type PortalWrapper = ComponentType<{ children: ReactNode }>;

const PortalWrapperContext = createContext<PortalWrapper | null>(null);

export type PortalWrapperProviderProps = {
  /**
   * The wrapper. Give a stable component (a module constant): a new
   * component mounts the content of each portal again.
   */
  value: PortalWrapper;
  /** The app */
  children: ReactNode;
};

/**
 * Gives a wrapper to the content of each Portal below it. A portal renders
 * at the end of the body, out of the elements of the host. The `Canvas` of
 * react-ui writes the color tokens on its element, thus its wrapper writes
 * them again around the content of a portal. The apps give no wrapper.
 */
export function PortalWrapperProvider({
  value,
  children,
}: PortalWrapperProviderProps) {
  return (
    <PortalWrapperContext.Provider value={value}>
      {children}
    </PortalWrapperContext.Provider>
  );
}

/** The wrapper of the nearest PortalWrapperProvider, or null */
export function usePortalWrapper(): PortalWrapper | null {
  return useContext(PortalWrapperContext);
}
