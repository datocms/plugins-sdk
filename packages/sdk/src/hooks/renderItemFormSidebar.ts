import {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';
import { ImposedSizePluginFrameCtx } from '../ctx/pluginFrame';
import { fullScreenRenderModeBootstrapper } from '../utils';

export type RenderItemFormSidebarHook = {
  /**
   * This function will be called when the plugin needs to render a sidebar (see
   * the `itemFormSidebars` hook)
   *
   * @tag sidebarPanels
   */
  renderItemFormSidebar: (
    sidebarId: string,
    ctx: RenderItemFormSidebarCtx,
  ) => void;
};

export type RenderItemFormSidebarCtx = ImposedSizePluginFrameCtx<
  'renderItemFormSidebar',
  ItemFormAdditionalProperties & {
    /** The ID of the sidebar that needs to be rendered */
    sidebarId: string;
    /**
     * The arbitrary `parameters` of the declared in the `itemFormSidebars`
     * function
     */
    parameters: Record<string, unknown>;
  },
  ItemFormAdditionalMethods
>;

export const renderItemFormSidebarBootstrapper =
  fullScreenRenderModeBootstrapper<RenderItemFormSidebarCtx>(
    'renderItemFormSidebar',
    (configuration, ctx) => {
      if (!configuration.renderItemFormSidebar) {
        return;
      }

      configuration.renderItemFormSidebar(ctx.sidebarId, ctx);
    },
  );
