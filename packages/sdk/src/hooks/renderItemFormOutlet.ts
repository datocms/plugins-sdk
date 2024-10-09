import {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';
import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderItemFormOutletHook = {
  /**
   * This function will be called when the plugin needs to render an outlet
   * defined by the `itemFormOutlets()` hook.
   *
   * @tag outlets
   */
  renderItemFormOutlet: (
    itemFormOutletId: string,
    ctx: RenderItemFormOutletCtx,
  ) => void;
};

export type RenderItemFormOutletCtx = SelfResizingPluginFrameCtx<
  'renderItemFormOutlet',
  ItemFormAdditionalProperties & {
    /** The ID of the outlet that needs to be rendered */
    itemFormOutletId: string;
  },
  ItemFormAdditionalMethods
>;

export const renderItemFormOutletBootstrapper =
  containedRenderModeBootstrapper<RenderItemFormOutletCtx>(
    'renderItemFormOutlet',
    (configuration, ctx) => {
      if (!configuration.renderItemFormOutlet) {
        return;
      }

      configuration.renderItemFormOutlet(ctx.itemFormOutletId, ctx);
    },
  );
