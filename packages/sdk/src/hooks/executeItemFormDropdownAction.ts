import { Ctx } from '../ctx/base';
import type {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';

export type ExecuteItemFormDropdownActionHook = {
  executeItemFormDropdownAction: (
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
