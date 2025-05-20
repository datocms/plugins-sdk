import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { MaybePromise } from '../utils';

type ItemUpdateSchema = SchemaTypes.ItemUpdateSchema;
type ItemCreateSchema = SchemaTypes.ItemCreateSchema;

export type OnBeforeItemUpsertHook = {
  /**
   * This function will be called before saving a new version of a record. You
   * can stop the action by returning `false`. Doing so will intercept the Save
   * button's handler, preventing the record save or creation.
   *
   * This hooks fires BEFORE serverside validation. If you return `false`,
   * nothing will get sent to our server and no serverside validation or
   * save will occur. If you return `true`, this hook will run first and then
   * serverside validation & saving will continue as usual.
   *
   * Clientside validations are not affected by this hook, since those occur
   * asynchronously and independently on individual fields' `onBlur()` events.
   *
   * @tag beforeHooks
   */
  onBeforeItemUpsert: (
    createOrUpdateItemPayload: ItemUpdateSchema | ItemCreateSchema,
    ctx: OnBeforeItemUpsertCtx,
  ) => MaybePromise<boolean>;
};

export type OnBeforeItemUpsertCtx = Ctx<
  {},
  {
    /**
     * Smoothly navigates to a specific field in the form. If the field is
     * localized it will switch language tab and then navigate to the chosen
     * field.
     *
     * @example
     *
     * ```js
     * const fieldPath = prompt(
     *   'Please insert the path of a field in the form',
     *   ctx.fieldPath,
     * );
     *
     * await ctx.scrollToField(fieldPath);
     * ```
     */
    scrollToField: (path: string, locale?: string) => Promise<void>;
  }
>;
