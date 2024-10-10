import type { SchemaTypes } from '@datocms/cma-client';
import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

type ItemType = SchemaTypes.ItemType;

export type RenderItemCollectionOutletHook = {
  /**
   * This function will be called when the plugin needs to render an outlet
   * defined by the `itemCollectionOutlets()` hook.
   *
   * @tag outlets
   */
  renderItemCollectionOutlet: (
    itemCollectionOutletId: string,
    ctx: RenderItemCollectionOutletCtx,
  ) => void;
};

export type RenderItemCollectionOutletCtx = SelfResizingPluginFrameCtx<
  'renderItemCollectionOutlet',
  {
    /** The ID of the outlet that needs to be rendered */
    itemCollectionOutletId: string;
    /** The model for which the outlet is being rendered */
    itemType: ItemType;
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
