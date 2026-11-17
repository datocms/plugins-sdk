import { useMemo } from 'react';
import type { UploadPresentationLoader } from 'ui-public/UploadPreview/presentation';
import { type BaseCtx, useLatestCtx } from './ctx';
import { entriesOfAnswer, warnOnceInDev } from './ctxAnswer';

/**
 * `ctx.loadUploads` of the release of the SDK that adds it. A host that is
 * older than that release does not give it.
 */
type CtxWithLoader = BaseCtx & {
  loadUploads?: UploadPresentationLoader;
};

/**
 * The loader of `UploadPreview` and `UploadCard` with an asset ID, from
 * `ctx`. With an older host there is no loader: the asset shows as an asset
 * that does not exist.
 */
export function useCtxUploadsLoader(
  ctx: BaseCtx,
): UploadPresentationLoader | undefined {
  const ctxRef = useLatestCtx(ctx);
  const hasLoader = typeof (ctx as CtxWithLoader).loadUploads === 'function';

  return useMemo<UploadPresentationLoader | undefined>(() => {
    if (hasLoader) {
      return async (uploadIds) =>
        entriesOfAnswer(
          await (ctxRef.current as CtxWithLoader).loadUploads?.(uploadIds),
          uploadIds.length,
          'loadUploads',
        );
    }

    if (!import.meta.env.DEV) {
      return undefined;
    }

    return async (uploadIds) => {
      warnOnceInDev(
        'loadUploads:missing',
        'The DatoCMS host of this plugin is older than ctx.loadUploads. UploadPreview and UploadCard with an asset ID show the asset as an asset that does not exist.',
      );

      return uploadIds.map(() => null);
    };
  }, [hasLoader]);
}
