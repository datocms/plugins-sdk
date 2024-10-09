import type { SchemaTypes } from '@datocms/cma-client';
import { ImposedSizePluginFrameCtx } from '../ctx/pluginFrame';
import { fullScreenRenderModeBootstrapper } from '../utils';

type Upload = SchemaTypes.Upload;

export type RenderUploadSidebarHook = {
  /**
   * This function will be called when the plugin needs to render a sidebar (see
   * the `uploadSidebars` hook)
   *
   * @tag sidebarPanels
   */
  renderUploadSidebar: (sidebarId: string, ctx: RenderUploadSidebarCtx) => void;
};

export type RenderUploadSidebarCtx = ImposedSizePluginFrameCtx<
  'renderUploadSidebar',
  {
    /** The ID of the sidebar that needs to be rendered */
    sidebarId: string;

    /**
     * The arbitrary `parameters` of the declared in the `uploadSidebars`
     * function
     */
    parameters: Record<string, unknown>;

    /** The active asset */
    upload: Upload;
  }
>;

export const renderUploadSidebarBootstrapper =
  fullScreenRenderModeBootstrapper<RenderUploadSidebarCtx>(
    'renderUploadSidebar',
    (configuration, ctx) => {
      if (!configuration.renderUploadSidebar) {
        return;
      }

      configuration.renderUploadSidebar(ctx.sidebarId, ctx);
    },
  );
