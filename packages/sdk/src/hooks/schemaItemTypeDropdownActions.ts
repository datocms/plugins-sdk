import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { DropdownAction, DropdownActionGroup } from '../shared';

type ItemType = SchemaTypes.ItemType;

export type SchemaItemTypeDropdownActionsHook = {
  /**
   * Use this function to define custom actions (or groups of actions) for a model/block model in the Schema section.
   *
   * The `executeSchemaItemTypeDropdownAction()` hook will be triggered once the user
   * clicks on one of the defined actions.
   *
   * @tag dropdownActions
   */
  schemaItemTypeDropdownActions: (
    itemType: ItemType,
    ctx: SchemaItemTypeDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type SchemaItemTypeDropdownActionsCtx = Ctx;
