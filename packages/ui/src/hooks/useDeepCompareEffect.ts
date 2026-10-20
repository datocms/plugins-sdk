import { DependencyList, EffectCallback, useEffect, useRef } from 'react';
import deepEqual from 'react-fast-compare';

// Like useEffect, but the effect runs again only when the dependencies have
// different contents. A new array or a new object with the same contents does
// not run it.
export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
) {
  const signalRef = useRef(0);
  const depsRef = useRef<DependencyList>(deps);

  if (!deepEqual(depsRef.current, deps)) {
    depsRef.current = deps;
    signalRef.current += 1;
  }

  useEffect(effect, [signalRef.current]);
}
