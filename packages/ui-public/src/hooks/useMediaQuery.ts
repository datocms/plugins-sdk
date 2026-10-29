import * as React from 'react';

type MediaQueryListEntry = {
  mql: MediaQueryList | { matches: boolean; media: string };
  notifiers: Array<React.Dispatch<React.SetStateAction<object>>>;
  listener: (mql: MediaQueryListEvent) => void;
};

const list: Record<string, MediaQueryListEntry | undefined> = {};

type MediaQueryFallback = { matches: boolean; media: string } | null;

export function useMediaQuery(
  media: string,
  fallback: MediaQueryFallback = null,
): MediaQueryList | { matches: boolean; media: string } {
  const mediaQueryList = React.useMemo(() => {
    // We have an existing mediaQueryList for media.
    if (list[media]) {
      return list[media].mql;
    }
    // Browser: create a new mediaQueryList.
    if (typeof window !== 'undefined') {
      return window.matchMedia(media);
    }
    // Server: use a fallback.
    return fallback || { matches: true, media };
  }, [media, fallback]);

  // Since the mediaQueryList is shared we use state to trigger re-renders.
  // This is done with update({}) (a new object instance will force a re-rendering).
  const [, update] = React.useState({});

  React.useLayoutEffect(() => {
    if (list[media]) {
      list[media].notifiers.push(update);
    } else {
      list[media] = {
        mql: mediaQueryList,
        notifiers: [update],
        listener: (mql: MediaQueryListEvent) => {
          const match = list[mql.media];
          if (match) {
            match.notifiers.forEach((updateFn) => {
              updateFn({});
            });
          }
        },
      };
      const entry = list[media]!;
      if ('addEventListener' in entry.mql) {
        (entry.mql as MediaQueryList).addEventListener(
          'change',
          entry.listener,
        );
      }
    }
    return () => {
      const entry = list[media];
      if (!entry) return;

      const notifierIndex = entry.notifiers.indexOf(update);
      if (notifierIndex > -1) {
        // Remove `update`.
        entry.notifiers.splice(notifierIndex, 1);
      }
      if (entry.notifiers.length === 0) {
        if ('removeEventListener' in entry.mql) {
          (entry.mql as MediaQueryList).removeEventListener(
            'change',
            entry.listener,
          );
        }
        list[media] = undefined;
      }
    };
  }, [media, mediaQueryList]);

  return mediaQueryList;
}

// A phone: a viewport narrower than the --lap breakpoint of
// styles/context/_media-queries.css (min-width: 480px). Keep the two equal.
export const PHONE_MEDIA_QUERY = '(max-width: 479.98px)';

export function useIsPhone() {
  return useMediaQuery(PHONE_MEDIA_QUERY).matches;
}

// A small viewport: the side panes become overlays and the bar of the app
// gets a menu button. Keep it equal to --small-viewport in
// styles/context/_media-queries.css (the CSS rules use that custom media).
export const SMALL_VIEWPORT_MEDIA_QUERY = '(max-width: 1024px)';

export function useIsSmallViewport() {
  return useMediaQuery(SMALL_VIEWPORT_MEDIA_QUERY).matches;
}
