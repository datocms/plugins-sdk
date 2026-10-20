import { DependencyList, useEffect, useRef } from 'react';
import { shallowEqualArrays } from 'shallow-equal';

export function useDidUpdateEffect(fn: () => void, deps: DependencyList) {
  const lastDepsRef = useRef<DependencyList | null>(null);

  // We compare the dependencies with the last run, not with a mount flag.
  // StrictMode runs the effect two times on mount with the same
  // dependencies, and a mount flag then calls fn.
  useEffect(() => {
    const lastDeps = lastDepsRef.current;
    lastDepsRef.current = deps;
    if (lastDeps && !shallowEqualArrays([...lastDeps], [...deps])) {
      fn();
    }
  }, deps);
}
