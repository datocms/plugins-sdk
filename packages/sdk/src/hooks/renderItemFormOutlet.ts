import {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';
import { ContainedPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderItemFormOutletHook = {
  /**
   * This function will be called when the plugin needs to render an outlet (see
   * the `itemFormOutlets` function)
   *
   * @tag itemFormOutlets
   */
  renderItemFormOutlet: (
    itemFormOutletId: string,
    ctx: RenderItemFormOutletCtx,
  ) => void;
};

export type RenderItemFormOutletCtx = ContainedPluginFrameCtx<
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
