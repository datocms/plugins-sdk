import type { SchemaTypes } from '@datocms/cma-client';
import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

export type RenderManualFieldExtensionConfigScreenHook = {
  renderManualFieldExtensionConfigScreen: (
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) => void;
};

export type RenderManualFieldExtensionConfigScreenCtx =
  SelfResizingPluginFrameCtx<
    'renderManualFieldExtensionConfigScreen',
    {
      /**
       * The ID of the field extension for which we need to render the parameters
       * form
       */
      fieldExtensionId: string;
      /**
       * The current value of the parameters (you can change the value with the
       * `setParameters` hook)
       */
      parameters: Record<string, unknown>;
      /**
       * The current validation errors for the parameters (you can set them
       * implementing the `validateManualFieldExtensionParameters` hook)
       */
      errors: Record<string, unknown>;

      /** The field entity that is being edited in the form */
      pendingField: PendingField;

      /** The model for the field being edited */
      itemType: ItemType;
    },
    {
      /**
       * Sets a new value for the parameters
       *
       * @example
       *
       * ```js
       * await ctx.setParameters({ color: '#ff0000' });
       * ```
       */
      setParameters: (params: Record<string, unknown>) => Promise<void>;
    }
  >;

export type PendingField = {
  id?: string;
  type: 'field';
  attributes: {
    api_key: Field['attributes']['api_key'];
    appearance: Field['attributes']['appearance'];
    default_value: Field['attributes']['default_value'];
    field_type: Field['attributes']['field_type'];
    hint: Field['attributes']['hint'];
    label: Field['attributes']['label'];
    localized: Field['attributes']['localized'];
    validators: Field['attributes']['validators'];
  };
};

export const renderManualFieldExtensionConfigScreenBootstrapper =
  containedRenderModeBootstrapper<RenderManualFieldExtensionConfigScreenCtx>(
    'renderManualFieldExtensionConfigScreen',
    (configuration, ctx) => {
      if (!configuration.renderManualFieldExtensionConfigScreen) {
        return;
      }

      configuration.renderManualFieldExtensionConfigScreen(
        ctx.fieldExtensionId,
        ctx,
      );
    },
  );
