import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createTickBatcher } from '../../utils/tickBatcher';
import type {
  RecordRowItem,
  RecordRowModel,
  RecordRowPresentation,
} from './types';

export type LoadRecordPresentationOptions = {
  preferredLocale?: string;
  /** In CSS pixels */
  preferredImageSize?: { width: number; height: number };
};

/**
 * Resolves the presentation of records. The result has one entry for each
 * record of `itemsOrIds`, in its order. The entry is null for a record that
 * does not exist or that the user cannot read.
 */
export type RecordPresentationLoader = (
  itemsOrIds: Array<string | RecordRowItem>,
  options: LoadRecordPresentationOptions,
) => Promise<Array<RecordRowPresentation | null>>;

export type RecordPresentationProviderProps = {
  /**
   * Resolves the records. Without it, a row with `item` shows the title of
   * a record that does not exist, and the model and the status of a full
   * record. Give a stable function.
   */
  load?: RecordPresentationLoader;
  /** The model from its ID. Give a stable function. */
  model: (itemTypeId: string) => RecordRowModel | null;
  children: ReactNode;
};

type ContextValue = {
  request: (
    options: LoadRecordPresentationOptions,
    itemOrId: string | RecordRowItem,
  ) => Promise<RecordRowPresentation | null>;
  model: RecordPresentationProviderProps['model'];
};

const RecordPresentationContext = createContext<ContextValue>({
  request: async () => null,
  model: () => null,
});

function optionsKey(options: LoadRecordPresentationOptions) {
  return JSON.stringify([
    options.preferredLocale ?? null,
    options.preferredImageSize?.width ?? null,
    options.preferredImageSize?.height ?? null,
  ]);
}

/**
 * Gives the loader of the presentation of records to the `RecordRow`s with
 * `item`. The rows of one render ask for their records in the same tick:
 * the provider sends them in one call to the loader, one call for each set
 * of options. It keeps no cache, so a row that renders again with a new
 * record asks again. A failed call gives null to its rows.
 */
export function RecordPresentationProvider({
  load,
  model,
  children,
}: RecordPresentationProviderProps) {
  const value = useMemo<ContextValue>(
    () => ({
      model,
      request: createTickBatcher<
        LoadRecordPresentationOptions,
        string | RecordRowItem,
        RecordRowPresentation | null
      >({
        groupKey: optionsKey,
        fallback: null,
        load: async (options, itemsOrIds) =>
          load ? load(itemsOrIds, options) : itemsOrIds.map(() => null),
      }),
    }),
    [load, model],
  );

  return (
    <RecordPresentationContext.Provider value={value}>
      {children}
    </RecordPresentationContext.Provider>
  );
}

export function useRecordPresentationModel() {
  return useContext(RecordPresentationContext).model;
}

/**
 * The presentation of a record from the loader of the provider. It is
 * undefined while it loads, and null when the record does not exist or the
 * loader failed. It loads again when the record changes, not when the record
 * changes on the server.
 */
export function useLoadedRecordPresentation(
  itemOrId: string | RecordRowItem,
  options: LoadRecordPresentationOptions,
) {
  const { request } = useContext(RecordPresentationContext);
  const [state, setState] = useState<{
    key: string;
    value: RecordRowPresentation | null;
  } | null>(null);

  // A full record loads again when its content changes, not only its ID
  const itemKey =
    typeof itemOrId === 'string' ? itemOrId : JSON.stringify(itemOrId);
  const key = `${itemKey}|${optionsKey(options)}`;

  const latest = useRef({ itemOrId, options });
  latest.current = { itemOrId, options };

  useEffect(() => {
    let active = true;

    request(latest.current.options, latest.current.itemOrId).then((value) => {
      if (active) {
        setState({ key, value });
      }
    });

    return () => {
      active = false;
    };
  }, [request, key]);

  return state?.key === key ? state.value : undefined;
}
