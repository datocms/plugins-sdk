import { ImposedSizePluginFrameCtx } from '../ctx/pluginFrame';
import { fullScreenRenderModeBootstrapper } from '../utils';

export type RenderInspectorPanelHook = {
  /**
   * This function will be called when an inspector needs to render a specific
   * panel (see the `renderInspector` and `setInspectorMode` functions)
   *
   * @tag inspector
   */
  renderInspectorPanel: (panelId: string, ctx: RenderInspectorPanelCtx) => void;
};

export type RenderInspectorPanelCtx = ImposedSizePluginFrameCtx<
  'renderInspectorPanel',
  {
    /** The ID of the inspector panel that needs to be rendered */
    panelId: string;

    /**
     * The arbitrary `parameters` of the modal declared in the `setInspectorMode`
     * function
     */
    parameters: Record<string, unknown>;
  }
>;

export const renderInspectorPanelBootstrapper =
  fullScreenRenderModeBootstrapper<RenderInspectorPanelCtx>(
    'renderInspectorPanel',
    (configuration, ctx) => {
      if (!configuration.renderInspectorPanel) {
        return;
      }

      configuration.renderInspectorPanel(ctx.panelId, ctx);
    },
  );
