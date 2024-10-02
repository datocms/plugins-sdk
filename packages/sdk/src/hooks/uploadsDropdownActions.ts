import { Ctx } from '../ctx/base';
import { DropdownAction, DropdownActionGroup } from '../shared';

export type UploadsDropdownActionsHook = {
  uploadsDropdownActions: (
    ctx: Ctx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};
