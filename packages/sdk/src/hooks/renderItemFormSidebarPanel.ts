import {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';
import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderItemFormSidebarPanelHook = {
  /**
   * This function will be called when the plugin needs to render a sidebar panel
   * (see the `itemFormSidebarPanels` hook)
   *
   * @tag sidebarPanels
   */
  renderItemFormSidebarPanel: (
    sidebarPaneId: string,
    ctx: RenderItemFormSidebarPanelCtx,
  ) => void;
};

export type RenderItemFormSidebarPanelCtx = SelfResizingPluginFrameCtx<
  'renderItemFormSidebarPanel',
  ItemFormAdditionalProperties & {
    /** The ID of the sidebar panel that needs to be rendered */
    sidebarPaneId: string;

    /**
     * The arbitrary `parameters` of the panel declared in the
     * `itemFormSidebarPanels` function
     */
    parameters: Record<string, unknown>;
  },
  ItemFormAdditionalMethods
>;

export const renderItemFormSidebarPanelBootstrapper =
  containedRenderModeBootstrapper<RenderItemFormSidebarPanelCtx>(
    'renderItemFormSidebarPanel',
    (configuration, ctx) => {
      if (!configuration.renderItemFormSidebarPanel) {
        return;
      }

      configuration.renderItemFormSidebarPanel(ctx.sidebarPaneId, ctx);
    },
  );
