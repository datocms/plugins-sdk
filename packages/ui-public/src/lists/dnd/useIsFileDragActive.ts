import { monitorForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { containsFiles } from '@atlaskit/pragmatic-drag-and-drop/utils/contains-files';
import { useEffect, useState } from 'react';

// Use useIsFileDragActive to hide hover UI (for example, a tooltip) while
// the user drags files from the operating system on the page.
//
// After the drop, the browser updates the hover state, thus the element
// under the pointer gets a "mouseenter" without a real move. The value stays
// true until the next real pointer move, thus that hover UI does not show
// at the drop.
export function useIsFileDragActive(): boolean {
  const [isDragging, setIsDragging] = useState(false);
  const [isWaitingForMove, setIsWaitingForMove] = useState(false);

  useEffect(
    () =>
      monitorForExternal({
        canMonitor: containsFiles,
        onDragStart: () => {
          setIsDragging(true);
          setIsWaitingForMove(false);
        },
        onDrop: () => {
          setIsDragging(false);
          setIsWaitingForMove(true);
        },
      }),
    [],
  );

  useEffect(() => {
    if (!isWaitingForMove) {
      return undefined;
    }

    const handleMove = () => setIsWaitingForMove(false);
    window.addEventListener('pointermove', handleMove, { once: true });

    return () => window.removeEventListener('pointermove', handleMove);
  }, [isWaitingForMove]);

  return isDragging || isWaitingForMove;
}
