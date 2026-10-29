import { useCallback, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  const ref = useRef<T>(null);

  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Do nothing if the target is not connected element with document
      if (!(event.target instanceof Node) || !event.target.isConnected) {
        return;
      }

      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    },
    [handler],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handleClick]);

  return ref;
}
