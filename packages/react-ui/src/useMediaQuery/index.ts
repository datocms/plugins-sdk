import React from 'react';

const list: Record<
  string,
  {
    mql: MediaQueryList;
    notifiers: Array<(value: Record<string, never>) => void>;
    listener: (mql: MediaQueryListEvent) => void;
  }
> = {};

export function useMediaQuery(media: string): MediaQueryList {
  const mediaQueryList = React.useMemo(() => {
    // We have an existing mediaQueryList for media.
    if (list[media]) {
      return list[media].mql;
    }

    if (typeof window !== 'undefined') {
      return matchMedia(media);
    }

    // Server: use a fallback.
    return { matches: true, media } as MediaQueryList;
  }, [list, media]);

  // Since the mediaQueryList is shared we use state to trigger re-renders.
  // This is done with update({}) (a new object instance will force a re-rendering).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = React.useState<Record<string, never>>({});

  React.useLayoutEffect(() => {
    if (list[media]) {
      list[media].notifiers.push(update);
    } else {
      list[media] = {
        mql: mediaQueryList,
        notifiers: [update],
        listener: (mql) => {
          const match = list[mql.media];
          if (match) {
            match.notifiers.forEach((updateFn) => updateFn({}));
          }
        },
      };
      list[media].mql.addEventListener('change', list[media].listener);
    }
    return () => {
      const notifierIndex = list[media].notifiers.indexOf(update);
      if (notifierIndex > -1) {
        // Remove `update`.
        list[media].notifiers.splice(notifierIndex, 1);
      }
      if (list[media].notifiers.length === 0) {
        list[media].mql.removeEventListener('change', list[media].listener);
        delete list[media];
      }
    };
  }, [list, media, mediaQueryList]);

  return mediaQueryList;
}

export type MediaQueryProps = {
  media: string;
  children: (mql: MediaQueryList) => JSX.Element;
};

export function MediaQuery({
  media,
  children,
}: MediaQueryProps): JSX.Element | null {
  const mql = useMediaQuery(media);
  return typeof children === 'function' ? children(mql) : null;
}

const DOM_LAYOUT_HANDLER_NAME = '__reactLayoutHandler';

const supportsBorderBox = (() => {
  if (typeof document === 'undefined') {
    return false;
  }
  const e = document.body.appendChild(document.createElement('div'));
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const observer = new ResizeObserver(() => {});
  try {
    observer.observe(e, { box: 'border-box' });
    observer.unobserve(e);
    return true;
  } catch (error) {
    return false;
  } finally {
    document.body.removeChild(e);
  }
})();

let resizeObserver: ResizeObserver | null = null;

function getResizeObserver(): ResizeObserver | undefined {
  if (resizeObserver) {
    return resizeObserver;
  }

  if (typeof ResizeObserver === 'undefined') {
    return;
  }

  resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const node = entry.target;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onLayout = (node as any)[DOM_LAYOUT_HANDLER_NAME] as
        | React.Dispatch<React.SetStateAction<DOMRect>>
        | undefined;

      if (typeof onLayout !== 'function') {
        return;
      }

      if (supportsBorderBox && entry.borderBoxSize) {
        const boxSize = entry.borderBoxSize[0] || entry.borderBoxSize;
        onLayout((prevRect) => {
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

      onLayout((prevRect) => {
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

  return resizeObserver;
}

export function useElementLayout(
  ref: React.MutableRefObject<Element> | React.RefObject<Element>,
): DOMRect {
  const observer = getResizeObserver();
  const [rect, setRect] = React.useState(new DOMRect());

  React.useLayoutEffect(() => {
    const node = ref.current;

    if (node) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any)[DOM_LAYOUT_HANDLER_NAME] = setRect;
    }

    if (node && observer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (node as any)[DOM_LAYOUT_HANDLER_NAME] === 'function') {
        observer.observe(
          node,
          supportsBorderBox ? { box: 'border-box' } : undefined,
        );
      } else {
        observer.unobserve(node);
      }
    }
    return () => {
      if (node != null && observer != null) {
        observer.unobserve(node);
      }
    };
  }, [ref, observer]);

  return rect;
}
