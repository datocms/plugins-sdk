import { ContainedPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderItemCollectionOutletHook = {
  renderItemCollectionOutlet: (
    itemCollectionOutletId: string,
    ctx: RenderItemCollectionOutletCtx,
  ) => void;
};

export type RenderItemCollectionOutletCtx = ContainedPluginFrameCtx<
  'renderItemCollectionOutlet',
  {
    /** The ID of the outlet that needs to be rendered */
    itemCollectionOutletId: string;
  }
>;

export const renderItemCollectionOutletBootstrapper =
  containedRenderModeBootstrapper<RenderItemCollectionOutletCtx>(
    'renderItemCollectionOutlet',
    (configuration, ctx) => {
      if (!configuration.renderItemCollectionOutlet) {
        return;
      }

      configuration.renderItemCollectionOutlet(ctx.itemCollectionOutletId, ctx);
    },
  );
