import React, { createContext, ReactNode, useContext } from 'react';

/** The current URL of the host, without the hash */
export type NavigationLocation = {
  /** The path of the URL, for example "/editor/items" */
  pathname: string;
  /** The query of the URL with its "?", or an empty string */
  search: string;
};

/** The options of a navigation */
export type NavigateOptions = {
  /**
   * The new URL replaces the current entry of the history
   * @default false
   */
  replace?: boolean;
};

/**
 * What the components of ui need from the router of the host. A `to` is
 * always a URL of the host as a string: the path with its query, for
 * example "/editor?tab=x". The state of a router does not go through the
 * adapter.
 */
export type NavigationAdapter = {
  /**
   * The location of the host, when the host has one. The components find
   * the active link and the open row from it. Without it, nothing is active
   * unless the caller gives `active`, and the open row of a
   * `ListDetail.Page` is not in the URL.
   */
  location?: NavigationLocation;
  /** Opens a page of the host */
  navigate: (to: string, options?: NavigateOptions) => void;
  /**
   * Gives the `href` attribute of a link to `to`. Without it, the `href` is
   * `to`. A host that is not on the origin of the page (a plugin in a frame)
   * gives the absolute URL, thus a new tab opens the correct page.
   */
  href?: (to: string) => string;
};

// Without a provider, a link is a normal link of the browser: the page
// reloads, and nothing is active.
const DEFAULT_ADAPTER: NavigationAdapter = {
  navigate: (to, options) => {
    if (options?.replace) {
      window.location.replace(to);
    } else {
      window.location.assign(to);
    }
  },
};

const NavigationContext = createContext<NavigationAdapter>(DEFAULT_ADAPTER);

export type NavigationProviderProps = {
  /** The router of the host. Give a stable object (`useMemo`). */
  value: NavigationAdapter;
  /** The app */
  children: ReactNode;
};

/**
 * Gives the router of the host to the components of ui. Put it once, near
 * the root, inside the router of the app.
 */
export function NavigationProvider({
  value,
  children,
}: NavigationProviderProps) {
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/** The router of the host, from the nearest NavigationProvider */
export function useNavigation() {
  return useContext(NavigationContext);
}

/** Divides a `to` into its path and its query (with its "?") */
export function splitTo(to: string): NavigationLocation {
  const index = to.indexOf('?');
  return index === -1
    ? { pathname: to, search: '' }
    : { pathname: to.slice(0, index), search: to.slice(index) };
}

// The location of the history package has a decoded pathname. We decode the
// path of `to` in the same way, thus a path with "%20" matches.
function decodePathname(pathname: string) {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
}

/**
 * Tells if the page of `to` is open. The match ignores the case and a slash
 * at the end, as `NavLink` of react-router does. When `exact` is false, the
 * pages under the path of `to` also match.
 */
export function isActivePath(
  pathname: string,
  to: string,
  exact = false,
): boolean {
  const toPathname = decodePathname(splitTo(to).pathname);

  if (toPathname === '') {
    return false;
  }

  const base = (
    toPathname.endsWith('/') ? toPathname.slice(0, -1) : toPathname
  ).toLowerCase();
  const current = pathname.toLowerCase();

  if (!current.startsWith(base)) {
    return false;
  }

  const rest = current.slice(base.length);

  return exact ? rest === '' || rest === '/' : rest === '' || rest[0] === '/';
}

export default NavigationProvider;
