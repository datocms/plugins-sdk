import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { ItemFormAdditionalProperties } from '../ctx/commonExtras/itemForm';
import { DropdownAction, DropdownActionGroup } from '../shared';

type ItemType = SchemaTypes.ItemType;

export type ItemFormDropdownActionsHook = {
  /**
   * Use this function to define custom actions (or groups of actions) to be
   * displayed at when editing a particular record.
   *
   * The `executeItemFormDropdownAction()` hook will be triggered once the user
   * clicks on one of the defined actions.
   *
   * @tag dropdownActions
   */
  itemFormDropdownActions: (
    itemType: ItemType,
    ctx: ItemFormDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type ItemFormDropdownActionsCtx = ItemFormDropdownActionsProperties;

export type ItemFormDropdownActionsProperties =
  Ctx<ItemFormAdditionalProperties>;
