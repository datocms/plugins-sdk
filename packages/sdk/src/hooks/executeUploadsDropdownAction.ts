import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';

type Upload = SchemaTypes.Upload;

export type ExecuteUploadsDropdownActionHook = {
  /**
   * Use this function to execute a particular dropdown action defined via
   * the `uploadsDropdownActions()` hook.
   *
   * @tag dropdownActions
   */
  executeUploadsDropdownAction: (
    /** The ID of the action that was requested by the user */
    actionId: string,
    /** The assets on which the action should be executed */
    uploads: Upload[],
    ctx: ExecuteUploadsDropdownActionCtx,
  ) => Promise<void>;
};

export type ExecuteUploadsDropdownActionCtx = Ctx<{
  parameters: Record<string, unknown> | undefined;
}>;
