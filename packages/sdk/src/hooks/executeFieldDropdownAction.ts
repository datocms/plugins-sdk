import { Ctx } from '../ctx/base';
import type { FieldAdditionalProperties } from '../ctx/commonExtras/field';
import type {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';

export type ExecuteFieldDropdownActionHook = {
  /**
   * Use this function to execute a particular dropdown action defined via
   * the `fieldDropdownActions()` hook.
   *
   * @tag dropdownActions
   */
  executeFieldDropdownAction: (
    /** The ID of the action that was requested by the user */
    actionId: string,
    ctx: ExecuteFieldDropdownActionCtx,
  ) => Promise<void>;
};

export type ExecuteFieldDropdownActionCtx = Ctx<
  ItemFormAdditionalProperties &
    FieldAdditionalProperties & {
      parameters: Record<string, unknown> | undefined;
    },
  ItemFormAdditionalMethods
>;
