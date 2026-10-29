import {
  dropTargetForElements,
  type ElementDropTargetEventBasePayload,
  type ElementDropTargetGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragSource, RefCallback } from './types';

export type DropTargetData = Record<string | symbol, unknown>;

export type DropTargetPayload = ElementDropTargetEventBasePayload;

export type UseDropTargetArgs = {
  // The function runs many times during a drag
  canDrop?: (source: DragSource) => boolean;
  // Gives the data that the monitors read from this drop target. The function
  // runs many times during a drag: a hitbox helper can add the position of
  // the pointer to the data.
  getData?: (args: ElementDropTargetGetFeedbackArgs) => DropTargetData;
  // When true, the drop target stays active when the pointer leaves it and
  // does not enter an other drop target
  sticky?: boolean;
  disabled?: boolean;
  onDragEnter?: (payload: DropTargetPayload) => void;
  onDragLeave?: (payload: DropTargetPayload) => void;
  // Runs at each movement of the pointer while this drop target is active
  onDrag?: (payload: DropTargetPayload) => void;
  onDrop?: (payload: DropTargetPayload) => void;
};

export type UseDropTargetResult = {
  ref: RefCallback;
  // True when the pointer is on this drop target, also when it is on a drop
  // target inside it
  isOver: boolean;
};

export function useDropTarget({
  canDrop,
  getData,
  sticky = false,
  disabled = false,
  onDragEnter,
  onDragLeave,
  onDrag,
  onDrop,
}: UseDropTargetArgs): UseDropTargetResult {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const latest = useRef({
    canDrop,
    getData,
    sticky,
    onDragEnter,
    onDragLeave,
    onDrag,
    onDrop,
  });
  latest.current = {
    canDrop,
    getData,
    sticky,
    onDragEnter,
    onDragLeave,
    onDrag,
    onDrop,
  };

  useEffect(() => {
    if (!element || disabled) {
      return;
    }

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => latest.current.canDrop?.(source) ?? true,
      getData: (args) => latest.current.getData?.(args) ?? {},
      getIsSticky: () => latest.current.sticky,
      onDragEnter: (payload) => {
        setIsOver(true);
        latest.current.onDragEnter?.(payload);
      },
      onDragLeave: (payload) => {
        setIsOver(false);
        latest.current.onDragLeave?.(payload);
      },
      onDrag: (payload) => latest.current.onDrag?.(payload),
      onDrop: (payload) => {
        setIsOver(false);
        latest.current.onDrop?.(payload);
      },
    });
  }, [element, disabled]);

  const ref = useCallback<RefCallback>((node) => setElement(node), []);

  return { ref, isOver };
}
