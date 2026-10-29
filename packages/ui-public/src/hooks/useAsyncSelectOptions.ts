import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BaseSelectOption, SelectSearch } from '../form/SelectInput';
import { useDebouncedCallback } from './useDebouncedCallback';

export type UseAsyncSelectOptionsConfig<O extends BaseSelectOption> = {
  /**
   * Gives the options that match the query. The hook calls it with an empty
   * query at mount, thus the menu is full when the user opens it. The signal
   * aborts when a newer query starts or when the component unmounts: give it
   * to `fetch`.
   */
  load: (query: string, signal: AbortSignal) => Promise<O[]>;
  /**
   * Gives the options of the values that no request of `load` returned (a
   * value that the page saved before). The hook calls it one time for each
   * value. Without it, such a value shows no text.
   */
  resolve?: (values: string[]) => Promise<O[]>;
  /** The value of the select */
  value: string | string[] | null;
  /**
   * The milliseconds of quiet typing before the hook calls `load`.
   * @default 200
   */
  debounce?: number;
};

export type AsyncSelectOptions<O extends BaseSelectOption> = {
  /** The options of the last query */
  options: O[];
  /** A request of `load` or of `resolve` runs */
  loading: boolean;
  /**
   * The error of the last request that failed, or `null`. The next request
   * of `load` that succeeds sets it back to `null`.
   */
  error: unknown;
  /** Give it to the `search` prop of `SelectInput` */
  search: SelectSearch;
  /**
   * Gives the option of a value from every option that the hook got. The
   * chips of a multiple select keep their labels when the options of the
   * query do not have them.
   */
  acceptValueNotIncludedInOptions: (value: string) => O | undefined;
};

function toValues(value: string | string[] | null): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * Loads the options of a `SelectInput` from a request: a search on a server
 * as the user types. Spread the result on `SelectInput`, next to `value` and
 * `onChange`.
 *
 * The hook gives the error in `error`, and does not throw it. A throw from
 * an async callback does not reach an error boundary, and a failed search
 * must not remove the form: the page shows the error next to the field.
 */
export function useAsyncSelectOptions<O extends BaseSelectOption>({
  load,
  resolve,
  value,
  debounce = 200,
}: UseAsyncSelectOptionsConfig<O>): AsyncSelectOptions<O> {
  const loadRef = useRef(load);
  loadRef.current = load;
  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;

  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<O[]>([]);
  const [cache, setCache] = useState<ReadonlyMap<string, O>>(() => new Map());
  const [loadingQuery, setLoadingQuery] = useState(true);
  const [resolveCount, setResolveCount] = useState(0);
  const [error, setError] = useState<unknown>(null);

  const remember = useCallback((newOptions: O[]) => {
    setCache((prev) => {
      const next = new Map(prev);
      for (const option of newOptions) {
        if (option.value != null) next.set(option.value, option);
      }
      return next;
    });
  }, []);

  // The cleanup aborts the request, thus only the response of the last
  // query sets the options. StrictMode runs the effect two times on mount:
  // the first request aborts, and the second one gives the options.
  useEffect(() => {
    const controller = new AbortController();
    setLoadingQuery(true);

    loadRef.current(query, controller.signal).then(
      (result) => {
        if (controller.signal.aborted) return;
        setOptions(result);
        remember(result);
        setError(null);
        setLoadingQuery(false);
      },
      (reason: unknown) => {
        if (controller.signal.aborted || isAbortError(reason)) return;
        setError(reason);
        setLoadingQuery(false);
      },
    );

    return () => controller.abort();
  }, [query, remember]);

  const values = toValues(value);
  const valuesKey = JSON.stringify(values);
  const requestedRef = useRef(new Set<string>());

  // We do not drop the result of `resolve` in a cleanup: an option in the
  // cache is correct also after the value changes. Thus StrictMode, which
  // runs the effect again at once, does not send the request two times.
  useEffect(() => {
    const resolveValues = resolveRef.current;
    if (!resolveValues) return;

    const missing = (JSON.parse(valuesKey) as string[]).filter(
      (v) => !cache.has(v) && !requestedRef.current.has(v),
    );
    if (missing.length === 0) return;

    for (const v of missing) requestedRef.current.add(v);
    setResolveCount((count) => count + 1);

    resolveValues(missing)
      .then(remember, (reason: unknown) => {
        for (const v of missing) requestedRef.current.delete(v);
        setError(reason);
      })
      .finally(() => setResolveCount((count) => count - 1));
  }, [valuesKey, cache, remember]);

  const onQueryChange = useDebouncedCallback(setQuery, debounce);
  const search = useMemo(() => ({ onQueryChange }), [onQueryChange]);

  const acceptValueNotIncludedInOptions = useCallback(
    (v: string) => cache.get(v),
    [cache],
  );

  return {
    options,
    loading: loadingQuery || resolveCount > 0,
    error,
    search,
    acceptValueNotIncludedInOptions,
  };
}
