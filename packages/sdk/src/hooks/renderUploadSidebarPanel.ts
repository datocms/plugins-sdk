import { SchemaTypes } from '@datocms/cma-client';
import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

type Upload = SchemaTypes.Upload;

export type RenderUploadSidebarPanelHook = {
  /**
   * This function will be called when the plugin needs to render a sidebar panel
   * (see the `uploadSidebarPanels` hook)
   *
   * @tag sidebarPanels
   */
  renderUploadSidebarPanel: (
    sidebarPaneId: string,
    ctx: RenderUploadSidebarPanelCtx,
  ) => void;
};

export type RenderUploadSidebarPanelCtx = SelfResizingPluginFrameCtx<
  'renderUploadSidebarPanel',
  {
    /** The ID of the sidebar panel that needs to be rendered */
    sidebarPaneId: string;

    /**
     * The arbitrary `parameters` of the panel declared in the
     * `uploadSidebarPanels` function
     */
    parameters: Record<string, unknown>;

    /** The active asset */
    upload: Upload;
  }
>;

export const renderUploadSidebarPanelBootstrapper =
  containedRenderModeBootstrapper<RenderUploadSidebarPanelCtx>(
    'renderUploadSidebarPanel',
    (configuration, ctx) => {
      if (!configuration.renderUploadSidebarPanel) {
        return;
      }

      configuration.renderUploadSidebarPanel(ctx.sidebarPaneId, ctx);
    },
  );
