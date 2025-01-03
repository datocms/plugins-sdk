import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { MaybePromise } from '../utils';

type ItemUpdateSchema = SchemaTypes.ItemUpdateSchema;
type ItemCreateSchema = SchemaTypes.ItemCreateSchema;

export type OnBeforeItemUpsertHook = {
  /**
   * This function will be called before saving a new version of a record. You
   * can stop the action by returning `false`
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
