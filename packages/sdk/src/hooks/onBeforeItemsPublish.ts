import type { RawApiTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { MaybePromise } from '../utils';

type Item = RawApiTypes.Item;

export type OnBeforeItemsPublishHook = {
  /**
   * This function will be called before publishing records. You can stop the
   * action by returning `false`
   *
   * @tag beforeHooks
   */
  onBeforeItemsPublish: (
    items: Item[],
    ctx: OnBeforeItemsPublishCtx,
  ) => MaybePromise<boolean>;
};

export type OnBeforeItemsPublishCtx = Ctx;
