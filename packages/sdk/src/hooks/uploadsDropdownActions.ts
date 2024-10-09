import { Ctx } from '../ctx/base';
import { DropdownAction, DropdownActionGroup } from '../shared';

export type UploadsDropdownActionsHook = {
  /**
   * This function lets you set up custom actions (or groups of actions) that
   * show up when the user:
   *
   * * selects multiple assets in the Media Area for batch operations, or
   * * opens up a specific asset from the Media Area.
   *
   * The `executeUploadsDropdownAction()` hook will be triggered once the user
   * clicks on one of the defined actions.
   *
   * @tag dropdownActions
   */
  uploadsDropdownActions: (
    ctx: UploadsDropdownActionsCtx,
  ) => Array<DropdownAction | DropdownActionGroup>;
};

type UploadsDropdownActionsCtx = Ctx;
