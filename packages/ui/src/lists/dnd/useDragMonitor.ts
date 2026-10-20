import {
  type ElementEventBasePayload,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { useEffect, useRef, useState } from 'react';
import { type DragData, type DragSource, getDragData } from './types';

export type UseDragMonitorArgs = {
  // Tells if the monitor listens to a drag. The function runs when the drag
  // starts.
  canMonitor?: (source: DragSource) => boolean;
  onDragStart?: (payload: ElementEventBasePayload) => void;
  onDrag?: (payload: ElementEventBasePayload) => void;
  onDropTargetChange?: (payload: ElementEventBasePayload) => void;
  onDrop?: (payload: ElementEventBasePayload) => void;
};

// Listens to the drags of the whole page. The callbacks always run with
// their last value.
export function useDragMonitor({
  canMonitor,
  onDragStart,
  onDrag,
  onDropTargetChange,
  onDrop,
}: UseDragMonitorArgs) {
  const latest = useRef({
    canMonitor,
    onDragStart,
    onDrag,
    onDropTargetChange,
    onDrop,
  });
  latest.current = {
    canMonitor,
    onDragStart,
    onDrag,
    onDropTargetChange,
    onDrop,
  };

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => latest.current.canMonitor?.(source) ?? true,
      onDragStart: (payload) => latest.current.onDragStart?.(payload),
      onDrag: (payload) => latest.current.onDrag?.(payload),
      onDropTargetChange: (payload) =>
        latest.current.onDropTargetChange?.(payload),
      onDrop: (payload) => latest.current.onDrop?.(payload),
    });
  }, []);
}

// Gives the data of the drag that is in progress, or null. Give a `kind` to
// listen to the drags of one kind of element only. The component renders
// again when a drag starts and when it ends.
export function useActiveDrag<T extends DragData = DragData>(
  kind?: string,
): T | null {
  const [data, setData] = useState<T | null>(null);

  useDragMonitor({
    canMonitor: (source) => !kind || getDragData(source).kind === kind,
    onDragStart: ({ source }) => setData(getDragData(source) as T),
    onDrop: () => setData(null),
  });

  return data;
}
