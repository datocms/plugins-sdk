import { FullScreenPluginFrameCtx } from '../ctx/pluginFrame';
import { fullScreenRenderModeBootstrapper } from '../utils';

export type RenderPageHook = {
  /**
   * This function will be called when the plugin needs to render a specific
   * page (see the `mainNavigationTabs`, `settingsAreaSidebarItemGroups` and
   * `contentAreaSidebarItems` functions)
   *
   * @tag pages
   */
  renderPage: (pageId: string, ctx: RenderPageCtx) => void;
};

export type RenderPageCtx = FullScreenPluginFrameCtx<
  'renderPage',
  {
    /** The ID of the page that needs to be rendered */
    pageId: string;
  }
>;

export const renderPageBootstrapper =
  fullScreenRenderModeBootstrapper<RenderPageCtx>(
    'renderPage',
    (configuration, ctx) => {
      if (!configuration.renderPage) {
        return;
      }

      configuration.renderPage(ctx.pageId, ctx);
    },
  );
