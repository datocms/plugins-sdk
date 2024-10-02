import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { DropdownAction, DropdownActionGroup } from '../shared';

type ItemType = SchemaTypes.ItemType;

export type ItemsDropdownActionsHook = {
  itemsDropdownActions: (
    itemType: ItemType,
    ctx: ItemDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type ItemDropdownActionsCtx = Ctx<{
  itemType: ItemType;
}>;
