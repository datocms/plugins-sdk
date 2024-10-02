import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';

type Upload = SchemaTypes.Upload;

export type ExecuteUploadsDropdownActionHook = {
  executeUploadsDropdownAction: (
    actionId: string,
    uploads: Upload[],
    ctx: ExecuteUploadsDropdownActionCtx,
  ) => Promise<void>;
};
export type ExecuteUploadsDropdownActionCtx = Ctx<{
  parameters: Record<string, unknown> | undefined;
}>;
