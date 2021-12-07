import { useCallback, useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
): React.RefObject<T> {
  const ref = useRef<T>(null);

  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.target;
      if (!ref.current || ref.current.contains(event.target as Node)) {
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
