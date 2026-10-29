import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  dropTargetForExternal,
  type ExternalDropTargetEventBasePayload,
  monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { containsFiles } from '@atlaskit/pragmatic-drag-and-drop/utils/contains-files';
import { getFiles } from '@atlaskit/pragmatic-drag-and-drop/utils/get-files';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/utils/prevent-unhandled';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefCallback } from './types';

export type UseFileDropTargetArgs = {
  /** Runs when the user drops files on the element. */
  onDrop: (files: File[]) => void;
  /**
   * Stops the element from taking files.
   * @default false
   */
  disabled?: boolean;
  /**
   * When `false`, `onDrop` gets only the first file.
   * @default true
   */
  multiple?: boolean;
};

export type UseFileDropTargetResult = {
  ref: RefCallback;
  // True only on the innermost file drop target
  isOver: boolean;
};

function isInnermost({ location, self }: ExternalDropTargetEventBasePayload) {
  return location.current.dropTargets[0]?.element === self.element;
}

// A drop out of a target does not open the file in the browser
export function useFileDropTarget({
  onDrop,
  disabled = false,
  multiple = true,
}: UseFileDropTargetArgs): UseFileDropTargetResult {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const latest = useRef({ onDrop, multiple });
  latest.current = { onDrop, multiple };

  useEffect(() => {
    if (!element || disabled) {
      return;
    }

    const updateIsOver = (payload: ExternalDropTargetEventBasePayload) =>
      setIsOver(isInnermost(payload));

    return combine(
      dropTargetForExternal({
        element,
        canDrop: containsFiles,
        onDragEnter: updateIsOver,
        onDropTargetChange: updateIsOver,
        onDragLeave: () => setIsOver(false),
        onDrop: (payload) => {
          setIsOver(false);

          if (!isInnermost(payload)) {
            return;
          }

          const files = getFiles(payload);

          if (files.length === 0) {
            return;
          }

          latest.current.onDrop(
            latest.current.multiple ? files : files.slice(0, 1),
          );
        },
      }),
      monitorForExternal({
        canMonitor: containsFiles,
        onDragStart: () => preventUnhandled.start(),
        onDrop: () => preventUnhandled.stop(),
      }),
    );
  }, [element, disabled]);

  useEffect(() => {
    if (disabled) {
      setIsOver(false);
    }
  }, [disabled]);

  const ref = useCallback<RefCallback>((node) => setElement(node), []);

  return { ref, isOver };
}
