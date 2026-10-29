import React, { useCallback } from 'react';
import { isActivePath, useNavigation } from './NavigationProvider';

export type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  /**
   * The page of the app that the link opens: the path with its query, for
   * example "/editor?tab=fields"
   */
  to: string;
  /**
   * The link is active only on its exact path, not on the pages under it.
   * Use it for the link to the root of a section.
   * @default false
   */
  exact?: boolean;
  /**
   * Forces the active state. Use it for a link that is also active on other
   * paths. Without it, the link is active when the path of the page matches
   * `to`. When the host gives no location, only `active` makes a link active.
   */
  active?: boolean;
  /**
   * The link replaces the current entry of the history, thus the Back
   * button of the browser does not come back to the current page
   * @default false
   */
  replace?: boolean;
};

function isModifiedEvent(event: React.MouseEvent) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

/**
 * A link to a page of the app, through the router of the host (see
 * NavigationProvider). When its page is open, it gets `aria-current="page"`:
 * give the active look with that attribute. For a link to another site, use
 * a normal `a`.
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, exact = false, active, replace = false, onClick, ...props }, ref) => {
    const { location, navigate, href } = useNavigation();
    const isActive =
      active ?? (location ? isActivePath(location.pathname, to, exact) : false);
    const isCurrentUrl =
      location !== undefined && to === location.pathname + location.search;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        // The browser handles the new tab, the new window and the download
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          (props.target && props.target !== '_self') ||
          isModifiedEvent(event)
        ) {
          return;
        }

        event.preventDefault();
        // A link to the current URL does not add an entry to the history,
        // as a link of the browser does
        navigate(to, { replace: replace || isCurrentUrl });
      },
      [onClick, props.target, navigate, to, replace, isCurrentUrl],
    );

    return (
      <a
        {...props}
        ref={ref}
        href={href ? href(to) : to}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
      />
    );
  },
);

export default Link;
