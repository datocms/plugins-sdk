import { useMemo } from 'react';
import type { NavigationAdapter } from 'ui-public/NavigationProvider';
import { type BaseCtx, useLatestCtx } from './ctx';

type CtxLocation = { pathname: string; search: string };

/** Only the ctx of a page and of an inspector has the location of the cms */
function locationOf(ctx: BaseCtx): CtxLocation | undefined {
  const { location } = ctx as BaseCtx & { location?: CtxLocation };
  return location;
}

/**
 * The router of ui-public from `ctx`. A `to` is a path of the cms, with the
 * environment. A click goes through `ctx.navigateTo`. The `href` is the
 * absolute URL of the page on the internal domain of the project, thus a
 * middle click opens the page of the cms in a new tab.
 */
export function useCtxNavigation(ctx: BaseCtx): NavigationAdapter {
  const ctxRef = useLatestCtx(ctx);

  const location = locationOf(ctx);
  const pathname = location?.pathname;
  const search = location?.search;
  const internalDomain = ctx.site.attributes.internal_domain;

  return useMemo<NavigationAdapter>(
    () => ({
      location:
        pathname === undefined ? undefined : { pathname, search: search ?? '' },
      // `ctx.navigateTo` always adds an entry to the history: it has no
      // "replace" option.
      navigate: (to) => {
        void ctxRef.current.navigateTo(to);
      },
      href: internalDomain
        ? (to) => `https://${internalDomain}${to}`
        : undefined,
    }),
    [pathname, search, internalDomain],
  );
}
