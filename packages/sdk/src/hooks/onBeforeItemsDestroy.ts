import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { MaybePromise } from '../utils';

type Item = SchemaTypes.Item;

export type OnBeforeItemsDestroyHook = {
  /**
   * This function will be called before destroying records. You can stop the
   * action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemsDestroy: (
    items: Item[],
    ctx: OnBeforeItemsDestroyCtx,
  ) => MaybePromise<boolean>;
};

export type OnBeforeItemsDestroyCtx = Ctx;
