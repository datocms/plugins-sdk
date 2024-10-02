import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';

type Item = SchemaTypes.Item;

export type ExecuteItemsDropdownActionHook = {
  executeItemsDropdownAction: (
    actionId: string,
    items: Item[],
    ctx: ExecuteItemsDropdownActionCtx,
  ) => Promise<void>;
};

export type ExecuteItemsDropdownActionCtx = Ctx<{
  parameters: Record<string, unknown> | undefined;
}>;
