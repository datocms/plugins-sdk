import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { MaybePromise } from '../utils';

type ItemUpdateSchema = SchemaTypes.ItemUpdateSchema;
type ItemCreateSchema = SchemaTypes.ItemCreateSchema;

export type OnBeforeItemUpsertHook = {
  /**
   * This hook is called when the user attempts to save a record. You can use it to block record saving.
   *
   * If you return `false`, the record will NOT be saved. A small on-page error will say "A plugin blocked the action".
   * However, for better UX, consider also using `ctx.alert()` to better explain to the user why their save was blocked.
   *
   * If you return `true`, the save will proceed as normal.
   *
   * This hook runs BEFORE serverside validation. You can use it to do your own additional validation before returning.
   * Clientside validations are not affected by this hook, since those occur on individual fields' `onBlur()` events.
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
