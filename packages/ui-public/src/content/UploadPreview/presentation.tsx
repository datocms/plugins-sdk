import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createTickBatcher } from '../../utils/tickBatcher';
import type { UploadPreviewUpload } from './upload';

/**
 * Loads assets by ID. The result has one entry for each ID, in its order.
 * The entry is null for an asset that does not exist or that the user cannot
 * read.
 */
export type UploadPresentationLoader = (
  uploadIds: string[],
) => Promise<Array<UploadPreviewUpload | null>>;

export type UploadPresentationProviderProps = {
  /**
   * Loads the assets. Without it, an asset by ID shows as an asset that does
   * not exist. Give a stable function.
   */
  load?: UploadPresentationLoader;
  /**
   * The main locale of the project: the first of its locales. The caption of
   * an `UploadCard` uses the default metadata of the asset in this locale
   * when the preferred locale has none.
   */
  mainLocale?: string;
  children: ReactNode;
};

type Request = (uploadId: string) => Promise<UploadPreviewUpload | null>;

type UploadPresentationValue = {
  request: Request;
  mainLocale: string | undefined;
};

const UploadPresentationContext = createContext<UploadPresentationValue>({
  request: async () => null,
  mainLocale: undefined,
});

/**
 * Gives the loader of assets to the `UploadPreview`s and `UploadCard`s with
 * an asset ID. The previews of one render ask for their assets in the same
 * tick: the provider sends them in one call to the loader. It keeps no
 * cache. A failed call gives null to its previews.
 */
export function UploadPresentationProvider({
  load,
  mainLocale,
  children,
}: UploadPresentationProviderProps) {
  const request = useMemo<Request>(() => {
    const batch = createTickBatcher<null, string, UploadPreviewUpload | null>({
      groupKey: () => '',
      fallback: null,
      load: async (_group, uploadIds) =>
        load ? load(uploadIds) : uploadIds.map(() => null),
    });

    return (uploadId) => batch(null, uploadId);
  }, [load]);

  const value = useMemo(() => ({ request, mainLocale }), [request, mainLocale]);

  return (
    <UploadPresentationContext.Provider value={value}>
      {children}
    </UploadPresentationContext.Provider>
  );
}

/**
 * The asset from the loader of the provider, or the asset itself when it is
 * not an ID. It is undefined while it loads, and null when the asset does not
 * exist or the loader failed.
 */
export function useLoadedUpload(
  upload: string | UploadPreviewUpload | null,
): UploadPreviewUpload | null | undefined {
  const { request } = useContext(UploadPresentationContext);
  const id = typeof upload === 'string' ? upload : null;
  const [state, setState] = useState<{
    id: string;
    value: UploadPreviewUpload | null;
  } | null>(null);

  useEffect(() => {
    if (id === null) {
      return;
    }

    let active = true;

    request(id).then((value) => {
      if (active) {
        setState({ id, value });
      }
    });

    return () => {
      active = false;
    };
  }, [request, id]);

  if (typeof upload !== 'string') {
    return upload;
  }

  return state?.id === upload ? state.value : undefined;
}

/** The main locale of the project, from the provider */
export function useUploadMainLocale() {
  return useContext(UploadPresentationContext).mainLocale;
}
