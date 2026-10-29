import { debounce } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';

// Returns a stable function that calls the latest `callback` once, `wait`
// milliseconds after the last call. The pending call is cancelled when the
// component unmounts.
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
): (...args: Args) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debounced = useMemo(
    () => debounce((...args: Args) => callbackRef.current(...args), wait),
    [wait],
  );

  useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
}
