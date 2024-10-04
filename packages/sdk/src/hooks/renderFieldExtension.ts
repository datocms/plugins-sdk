import { FieldAdditionalProperties } from '../ctx/commonExtras/field';
import {
  ItemFormAdditionalMethods,
  ItemFormAdditionalProperties,
} from '../ctx/commonExtras/itemForm';

import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderFieldExtensionHook = {
  /**
   * This function will be called when the plugin needs to render a field
   * extension (see the `manualFieldExtensions` and `overrideFieldExtensions`
   * functions)
   *
   * @tag forcedFieldExtensions
   */
  renderFieldExtension: (
    fieldExtensionId: string,
    ctx: RenderFieldExtensionCtx,
  ) => void;
};

export type RenderFieldExtensionCtx = SelfResizingPluginFrameCtx<
  'renderFieldExtension',
  ItemFormAdditionalProperties &
    FieldAdditionalProperties & {
      /** The ID of the field extension that needs to be rendered */
      fieldExtensionId: string;
      /** The arbitrary `parameters` of the field extension */
      parameters: Record<string, unknown>;
    },
  ItemFormAdditionalMethods
>;

export const renderFieldExtensionBootstrapper =
  containedRenderModeBootstrapper<RenderFieldExtensionCtx>(
    'renderFieldExtension',
    (configuration, ctx) => {
      if (!configuration.renderFieldExtension) {
        return;
      }

      configuration.renderFieldExtension(ctx.fieldExtensionId, ctx);
    },
  );
