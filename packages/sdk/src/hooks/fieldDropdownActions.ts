import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { FieldAdditionalProperties } from '../ctx/commonExtras/field';
import { ItemFormAdditionalProperties } from '../ctx/commonExtras/itemForm';
import { DropdownAction, DropdownActionGroup } from '../shared';

type Field = SchemaTypes.Field;

export type FieldDropdownActionsHook = {
  fieldDropdownActions: (
    field: Field,
    ctx: FieldDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

export type FieldDropdownActionsCtx = Ctx<
  ItemFormAdditionalProperties & FieldAdditionalProperties
>;
