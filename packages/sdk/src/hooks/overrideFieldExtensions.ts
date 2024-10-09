import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { ItemFormSidebarPanelPlacement } from '../shared';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

export type OverrideFieldExtensionsHook = {
  /**
   * Use this function to automatically force one or more field extensions to a
   * particular field
   *
   * @tag forcedFieldExtensions
   */
  overrideFieldExtensions: (
    field: Field,
    ctx: OverrideFieldExtensionsCtx,
  ) => FieldExtensionOverride | undefined;
};

export type OverrideFieldExtensionsCtx = Ctx<{
  itemType: ItemType;
}>;

/**
 * An object expressing some field extensions you want to force on a particular
 * field
 */
export type FieldExtensionOverride = {
  /** Force a field editor/sidebar extension on a field */
  editor?: EditorOverride;
  /** One or more field sidebar extensions to forcefully add to a field */
  addons?: AddonOverride[];
};

/** A field editor/sidebar forced on a field */
export type EditorOverride = {
  /**
   * ID of field extension. Will be the first argument for the
   * `renderFieldExtension` function
   */
  id: string;
  /**
   * Moves the field to the sidebar of the record editing page, mimicking a
   * sidebar panel
   */
  asSidebarPanel?:
    | boolean
    | { startOpen?: boolean; placement?: ItemFormSidebarPanelPlacement };
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderFieldExtension` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple plugins override a field, the one with the lowest `rank` will
   * win. If you want to specify an explicit value for `rank`, make sure to
   * offer a way for final users to customize it inside the plugin's settings
   * form, otherwise the hardcoded value you choose might clash with the one of
   * another plugin!
   */
  rank?: number;
  /**
   * The initial height to set for the iframe that will render the field
   * extension
   */
  initialHeight?: number;
};

/** A field addon extension forced on a field */
export type AddonOverride = {
  /**
   * ID of field extension. Will be the first argument for the
   * `renderFieldExtension` function
   */
  id: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderFieldExtension` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple addons are present for a field, they will be sorted by
   * ascending `rank`. If you want to specify an explicit value for `rank`, make
   * sure to offer a way for final users to customize it inside the plugin's
   * settings form, otherwise the hardcoded value you choose might clash with
   * the one of another plugin!
   */
  rank?: number;
  /**
   * The initial height to set for the iframe that will render the field
   * extension
   */
  initialHeight?: number;
};
