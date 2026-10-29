import useMergedRef from '@react-hook/merged-ref';
import React, { type RefObject, useEffect, useRef } from 'react';
import { useLayerCoversPage } from '../actions/Actions/registry';
import { useNavigationFocus } from './NavigationFocusProvider';

export type MainProps = Omit<React.HTMLAttributes<HTMLElement>, 'id'>;

const SECONDARY_PANE = '.SplitPane__secondary-host, .SplitPaneOverlay';

/**
 * The content of the first `Pane` of `main` that is not in the secondary
 * pane of a `SplitPane`: the side list of a page is not its content.
 */
function primaryPaneContent(main: HTMLElement) {
  for (const content of Array.from(
    main.querySelectorAll<HTMLElement>('.Pane__content'),
  )) {
    const secondary = content.closest(SECONDARY_PANE);
    if (!secondary || !main.contains(secondary)) return content;
  }
  return null;
}

// A main without a tabindex cannot take the focus. The tabindex goes away
// on blur, thus a click on the page does not focus the main.
function focusMain(main: HTMLElement) {
  main.setAttribute('tabindex', '-1');
  main.focus({ preventScroll: true });
  if (document.activeElement !== main) {
    main.removeAttribute('tabindex');
    return;
  }
  main.addEventListener('blur', () => main.removeAttribute('tabindex'), {
    once: true,
  });
}

/** Moves the focus into the page when the pathname of the host changes */
function useFocusOnNavigation(mainRef: RefObject<HTMLElement | null>) {
  // The value changes only with the pathname
  const navigation = useNavigationFocus();

  useEffect(() => {
    const main = mainRef.current;
    if (!navigation || !main) return;
    const { pathname, consumed } = navigation;
    if (pathname === consumed.current) return;

    // The page is under a dialog. The Main of the dialog takes the change.
    if (main.closest('[inert]')) return;

    // The page took the focus itself: an autofocused field
    if (main.contains(document.activeElement)) {
      consumed.current = pathname;
      return;
    }

    const content = primaryPaneContent(main);
    if (content) content.focus({ preventScroll: true });
    else focusMain(main);

    // A hidden Main (a page that Suspense keeps) cannot take the focus, and
    // must leave the change to the Main of the new page
    if (main.contains(document.activeElement)) {
      consumed.current = pathname;
    }
  }, [navigation, mainRef]);
}

/**
 * The main content of the page: a landmark. A page has only one. It always
 * has the id "main-content", because the skip link of the authenticated
 * layout points to it. A heading of level 1 goes inside it. In a dialog, it
 * replaces the main content of the page: the dialog covers the page, and the
 * host can make the page inert (see `useIsPageCovered`). In a
 * `NavigationFocusProvider`, it takes the focus when the pathname changes.
 */
const Main = React.forwardRef<HTMLElement, MainProps>(
  function Main(props, ref) {
    const mainRef = useRef<HTMLElement>(null);
    const mergedRef = useMergedRef(ref, mainRef);

    useLayerCoversPage();
    useFocusOnNavigation(mainRef);

    return <main {...props} id="main-content" ref={mergedRef} />;
  },
);

export default Main;
