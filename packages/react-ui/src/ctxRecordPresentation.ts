import { useCallback, useMemo } from 'react';
import type { RecordRowModel } from 'ui-public/RecordRow';
import type { RecordPresentationLoader } from 'ui-public/RecordRow/presentation';
import { type BaseCtx, useLatestCtx } from './ctx';
import { entriesOfAnswer, warnOnceInDev } from './ctxAnswer';

/**
 * `ctx.loadItemPresentationInfo` of the release of the SDK that adds it. A
 * host that is older than that release does not give it.
 */
type CtxWithLoader = BaseCtx & {
  loadItemPresentationInfo?: RecordPresentationLoader;
};

/**
 * The loader and the models of `RecordRow` with `item`, from `ctx`. With an
 * older host there is no loader: the row shows the title of a record with
 * no title, and the model and the status of a full record.
 */
export function useCtxRecordPresentation(ctx: BaseCtx) {
  const ctxRef = useLatestCtx(ctx);
  const hasLoader =
    typeof (ctx as CtxWithLoader).loadItemPresentationInfo === 'function';

  const load = useMemo<RecordPresentationLoader | undefined>(() => {
    if (hasLoader) {
      return async (itemsOrIds, options) =>
        entriesOfAnswer(
          await (ctxRef.current as CtxWithLoader).loadItemPresentationInfo?.(
            itemsOrIds,
            options,
          ),
          itemsOrIds.length,
          'loadItemPresentationInfo',
        );
    }

    if (!import.meta.env.DEV) {
      return undefined;
    }

    return async (itemsOrIds) => {
      warnOnceInDev(
        'loadItemPresentationInfo:missing',
        'The DatoCMS host of this plugin is older than ctx.loadItemPresentationInfo. RecordRow with item shows the record without its title and its image.',
      );

      return itemsOrIds.map(() => null);
    };
  }, [hasLoader]);

  const { itemTypes } = ctx;

  const model = useCallback(
    (itemTypeId: string): RecordRowModel | null => {
      const itemType = itemTypes[itemTypeId];

      return itemType
        ? {
            name: itemType.attributes.name,
            draftModeActive: Boolean(itemType.attributes.draft_mode_active),
          }
        : null;
    },
    [itemTypes],
  );

  return { load, model };
}
