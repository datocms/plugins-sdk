import { Ctx } from '../ctx/base';
import type { FieldAdditionalProperties } from '../ctx/commonExtras/field';
import type {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';

export type ExecuteFieldDropdownActionHook = {
  executeFieldDropdownAction: (
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
