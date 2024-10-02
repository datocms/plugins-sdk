import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { ItemFormAdditionalProperties } from '../ctx/commonExtras/itemForm';
import { DropdownAction, DropdownActionGroup } from '../shared';

type ItemType = SchemaTypes.ItemType;

export type ItemFormDropdownActionsHook = {
  itemFormDropdownActions: (
    itemType: ItemType,
    ctx: ItemFormDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type ItemFormDropdownActionsCtx = ItemFormDropdownActionsProperties;

export type ItemFormDropdownActionsProperties =
  Ctx<ItemFormAdditionalProperties>;
