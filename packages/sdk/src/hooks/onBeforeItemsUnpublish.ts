import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { MaybePromise } from '../utils';

type Item = SchemaTypes.Item;

export type OnBeforeItemsUnpublishHook = {
  /**
   * This function will be called before unpublishing records. You can stop the
   * action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemsUnpublish: (
    items: Item[],
    ctx: OnBeforeItemsUnpublishCtx,
  ) => MaybePromise<boolean>;
};

export type OnBeforeItemsUnpublishCtx = Ctx;
