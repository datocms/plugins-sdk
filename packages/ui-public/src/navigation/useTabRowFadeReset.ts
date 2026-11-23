import { useCallback, useRef } from 'react';

/**
 * Keeps the edge fades of a `.Toolbar__tabs` row correct when the row stops
 * scrolling. The fades are scroll-driven animations. Chromium keeps the last
 * value of such an animation when its scroll timeline becomes inactive. Thus
 * a row that scrolls while it is narrow (a sidebar that opens) keeps a fade
 * after it grows. The hook restarts the animations when the row stops
 * scrolling, and the fades go back to zero. Give the callback ref to the row.
 */
export function useTabRowFadeReset<T extends HTMLElement>() {
  const observerRef = useRef<ResizeObserver | null>(null);

  return useCallback((row: T | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!row || typeof ResizeObserver === 'undefined') {
      return;
    }

    const scrolls = () => row.scrollWidth > row.clientWidth;
    let scrolled = scrolls();

    const observer = new ResizeObserver(() => {
      const scrollsNow = scrolls();

      if (scrolled && !scrollsNow) {
        row.style.animation = 'none';
        // A read of the layout applies the change before the next line
        void row.offsetWidth;
        row.style.animation = '';
      }

      scrolled = scrollsNow;
    });

    observer.observe(row);
    observerRef.current = observer;
  }, []);
}
