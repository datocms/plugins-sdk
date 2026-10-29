import { useEffect, useState } from 'react';

/**
 * A hook that returns a debounced version of the provided value.
 * The returned value will only update after the specified delay
 * has passed without the input value changing.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
