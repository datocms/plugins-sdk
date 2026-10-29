import { useRef } from 'react';

let counter = 0;

/** Returns a stable, unique integer ID for the lifetime of a component instance. */
export const useAutoincrementIntegerId = (): number => {
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) {
    idRef.current = ++counter;
  }
  return idRef.current;
};
