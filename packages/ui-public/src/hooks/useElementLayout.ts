import * as React from 'react';

/*
  Derived from https://raw.githubusercontent.com/necolas/react-native-web/78174d7b487bb37d2f15c21e38a5beb2ad196da4/packages/react-native-web/src/modules/useElementLayout/index.js
  The pre-hooks, original version was authored by Giuseppe Gurgone https://github.com/necolas/react-native-web/commit/5a04d07a35fe0a7d8db9f0ddc3efe27f06c6e682
*/

const DOM_LAYOUT_HANDLER_NAME = '__reactLayoutHandler' as const;

type LayoutHandler = React.Dispatch<
  React.SetStateAction<DOMRect> | ((prev: DOMRect) => DOMRect)
>;

type ElementWithLayoutHandler = Element & {
  [DOM_LAYOUT_HANDLER_NAME]?: LayoutHandler;
};

let resizeObserver: ResizeObserver | null = null;

function getResizeObserver(): ResizeObserver | null {
  if (resizeObserver == null && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(function resizeObserverCallback(
      entries: ResizeObserverEntry[],
    ) {
      entries.forEach((entry) => {
        const node = entry.target as ElementWithLayoutHandler;
        const onLayout = node[DOM_LAYOUT_HANDLER_NAME];

        if (typeof onLayout !== 'function') {
          return;
        }

        if (entry.borderBoxSize) {
          const boxSize = Array.isArray(entry.borderBoxSize)
            ? entry.borderBoxSize[0]
            : entry.borderBoxSize;
          onLayout((prevRect: DOMRect) => {
            if (
              prevRect.width === boxSize.inlineSize &&
              prevRect.height === boxSize.blockSize
            ) {
              return prevRect;
            }
            return new DOMRect(0, 0, boxSize.inlineSize, boxSize.blockSize);
          });
          return;
        }

        const elRect = entry.target.getBoundingClientRect();
        onLayout((prevRect: DOMRect) => {
          if (
            prevRect.width === elRect.width &&
            prevRect.height === elRect.height
          ) {
            return prevRect;
          }
          return new DOMRect(0, 0, elRect.width, elRect.height);
        });
      });
    });
  }
  return resizeObserver;
}

// A render on a server has no DOMRect.
function emptyRect(): DOMRect {
  return typeof DOMRect === 'undefined'
    ? ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      } as DOMRect)
    : new DOMRect();
}

export function useElementLayout(
  ref: React.RefObject<ElementWithLayoutHandler | null>,
): DOMRect {
  const [rect, setRect] = React.useState(emptyRect);

  React.useLayoutEffect(() => {
    const observer = getResizeObserver();
    const node = ref.current;
    if (node != null) {
      node[DOM_LAYOUT_HANDLER_NAME] = setRect;
    }
    if (node != null && observer != null) {
      if (typeof node[DOM_LAYOUT_HANDLER_NAME] === 'function') {
        observer.observe(node, { box: 'border-box' });
      } else {
        observer.unobserve(node);
      }
    }
    return () => {
      if (node != null && observer != null) {
        observer.unobserve(node);
      }
    };
  }, [ref]);

  return rect;
}
