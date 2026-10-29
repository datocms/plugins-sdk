import { useEffect, useState } from 'react';

export function useDebounceOnBoolean(
  value: boolean,
  delayOnTrue: number,
  delayOnFalse: number,
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  function set(newValue: boolean, delay: number) {
    if (delay) {
      const handler = setTimeout(() => {
        setDebouncedValue(newValue);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    } else {
      setDebouncedValue(newValue);
    }
  }

  useEffect(() => {
    if (value) {
      return set(true, delayOnTrue);
    } else {
      return set(false, delayOnFalse);
    }
  }, [value, delayOnFalse, delayOnTrue]);

  return debouncedValue;
}
