import {
  draggable,
  type ElementEventBasePayload,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/utils/disable-native-drag-preview';
import { useCallback, useEffect, useRef, useState } from 'react';
import { enableAutoScrollAround } from './autoScroll';
import type { DragData, RefCallback } from './types';

export type DragPreview =
  // The browser makes a picture of the element (the default)
  | 'element'
  // The browser shows no picture: the element itself shows the drag
  | 'none'
  // An element that the browser shows as the picture. The function runs
  // when the drag starts. For an element in the page, the pointer stays at
  // the same place on the picture.
  | (() => Element | null);

export type UseDraggableArgs = {
  // The data that the drop targets and the monitors receive. The function
  // runs when the drag starts.
  getData: () => DragData;
  disabled?: boolean;
  // When true, the user can drag the element only from the element that you
  // give to `handleRef`. The element is not draggable until the handle is in
  // the DOM.
  handle?: boolean;
  preview?: DragPreview;
  onDragStart?: (payload: ElementEventBasePayload) => void;
  onDrop?: (payload: ElementEventBasePayload) => void;
};

export type UseDraggableResult = {
  // Give it to the element that moves
  ref: RefCallback;
  // Give it to the element that the user drags, when `handle` is true
  handleRef: RefCallback;
  isDragging: boolean;
};

// The hook registers the element again only when the element, the handle or
// `disabled` change: the callbacks always run with their last value.
export function useDraggable({
  getData,
  disabled = false,
  handle = false,
  preview = 'element',
  onDragStart,
  onDrop,
}: UseDraggableArgs): UseDraggableResult {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [handleElement, setHandleElement] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const latest = useRef({ getData, preview, onDragStart, onDrop });
  latest.current = { getData, preview, onDragStart, onDrop };

  useEffect(() => {
    if (!element || disabled || (handle && !handleElement)) {
      return;
    }

    let disableAutoScroll: (() => void) | null = null;

    return draggable({
      element,
      // A handle that is in the DOM is always the handle, also when the
      // element does not wait for it
      dragHandle: handleElement ?? undefined,
      getInitialData: () => latest.current.getData(),
      onGenerateDragPreview: ({ nativeSetDragImage, location }) => {
        const { preview } = latest.current;

        if (preview === 'none') {
          disableNativeDragPreview({ nativeSetDragImage });
        } else if (typeof preview === 'function') {
          const image = preview();

          if (image && nativeSetDragImage) {
            const { clientX, clientY } = location.initial.input;
            const rect = image.isConnected
              ? image.getBoundingClientRect()
              : null;

            nativeSetDragImage(
              image,
              rect ? clientX - rect.left : 0,
              rect ? clientY - rect.top : 0,
            );
          }
        }
      },
      onDragStart: (payload) => {
        disableAutoScroll = enableAutoScrollAround(element);
        setIsDragging(true);
        latest.current.onDragStart?.(payload);
      },
      onDrop: (payload) => {
        disableAutoScroll?.();
        disableAutoScroll = null;
        setIsDragging(false);
        latest.current.onDrop?.(payload);
      },
    });
  }, [element, handleElement, handle, disabled]);

  const ref = useCallback<RefCallback>((node) => setElement(node), []);
  const handleRef = useCallback<RefCallback>(
    (node) => setHandleElement(node),
    [],
  );

  return { ref, handleRef, isDragging };
}
