import { Ctx } from '../ctx/base';
import type {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';

export type ExecuteItemFormDropdownActionHook = {
  /**
   * Use this function to execute a particular dropdown action defined via
   * the `itemFormDropdownActions()` hook.
   *
   * @tag dropdownActions
   */
  executeItemFormDropdownAction: (
    /** The ID of the action that was requested by the user */
    actionId: string,
    ctx: ExecuteItemFormDropdownActionCtx,
  ) => Promise<void>;
};

export type ExecuteItemFormDropdownActionCtx = Ctx<
  ItemFormAdditionalProperties & {
    parameters: Record<string, unknown> | undefined;
  },
  ItemFormAdditionalMethods
>;
