import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';

type ItemType = SchemaTypes.ItemType;

export type ExecuteSchemaItemTypeDropdownActionHook = {
  /**
   * Use this function to execute a particular dropdown action defined via
   * the `schemaItemTypeDropdownActions()` hook.
   *
   * @tag dropdownActions
   */
  executeSchemaItemTypeDropdownAction: (
    /** The ID of the action that was requested by the user */
    actionId: string,
    /** The model/block model on which the action should be executed */
    itemType: ItemType,
    ctx: ExecuteSchemaItemTypeDropdownActionCtx,
  ) => Promise<void>;
};

export type ExecuteSchemaItemTypeDropdownActionCtx = Ctx<{
  parameters: Record<string, unknown> | undefined;
}>;
