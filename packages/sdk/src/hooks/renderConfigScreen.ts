import { ContainedPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderConfigScreenHook = {
  /**
   * This function will be called when the plugin needs to render the plugin's
   * configuration form
   *
   * @tag configScreen
   */
  renderConfigScreen: (ctx: RenderConfigScreenCtx) => void;
};

export type RenderConfigScreenCtx = ContainedPluginFrameCtx<
  'renderConfigScreen',
  {},
  {}
>;

export const renderConfigScreenBootstrapper =
  containedRenderModeBootstrapper<RenderConfigScreenCtx>(
    'renderConfigScreen',
    (configuration, ctx) => {
      if (!configuration.renderConfigScreen) {
        return;
      }

      configuration.renderConfigScreen(ctx);
    },
  );
