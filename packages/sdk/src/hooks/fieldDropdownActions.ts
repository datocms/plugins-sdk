import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { FieldAdditionalProperties } from '../ctx/commonExtras/field';
import { ItemFormAdditionalProperties } from '../ctx/commonExtras/itemForm';
import { DropdownAction, DropdownActionGroup } from '../shared';

type Field = SchemaTypes.Field;

export type FieldDropdownActionsHook = {
  /**
   * Use this function to define custom actions (or groups of actions) to be
   * displayed at the individual field level in the record editing form.
   *
   * The `executeFieldDropdownAction()` hook will be triggered once the user
   * clicks on one of the defined actions.
   *
   * @tag dropdownActions
   */
  fieldDropdownActions: (
    field: Field,
    ctx: FieldDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type FieldDropdownActionsCtx = Ctx<
  ItemFormAdditionalProperties & FieldAdditionalProperties
>;
