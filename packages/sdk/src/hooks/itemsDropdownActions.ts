import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { DropdownAction, DropdownActionGroup } from '../shared';

type ItemType = SchemaTypes.ItemType;

export type ItemsDropdownActionsHook = {
  /**
   * This function lets you set up custom actions (or groups of actions) that
   * show up when the user:
   *
   * * selects multiple records in the collection view for batch operations, or
   * * starts editing a specific record.
   *
   * The `executeItemsDropdownAction()` hook will be triggered once the user
   * clicks on one of the defined actions.
   *
   * @tag dropdownActions
   */
  itemsDropdownActions: (
    itemType: ItemType,
    ctx: ItemDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type ItemDropdownActionsCtx = Ctx<{
  itemType: ItemType;
}>;
