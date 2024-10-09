import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';

type Item = SchemaTypes.Item;

export type ExecuteItemsDropdownActionHook = {
  /**
   * Use this function to execute a particular dropdown action defined via
   * the `itemsDropdownActions()` hook.
   *
   * @tag dropdownActions
   */
  executeItemsDropdownAction: (
    /** The ID of the action that was requested by the user */
    actionId: string,
    /** The records on which the action should be executed */
    items: Item[],
    ctx: ExecuteItemsDropdownActionCtx,
  ) => Promise<void>;
};

export type ExecuteItemsDropdownActionCtx = Ctx<{
  parameters: Record<string, unknown> | undefined;
}>;
