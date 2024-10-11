import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import {
  isArray,
  isBoolean,
  isNullish,
  isNumber,
  isPlacement,
  isRecord,
  isString,
} from '../guardUtils.js';
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
 *
 * @see {isFieldExtensionOverride}
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

export function isFieldExtensionOverride(
  value: unknown,
): value is FieldExtensionOverride {
  return (
    isNullish(value) ||
    (isRecord(value) &&
      (isNullish(value.editor) || isEditorOverride(value.editor)) &&
      (isNullish(value.addons) || isArray(value.addons, isAddonOverride)))
  );
}

export function isEditorOverride(value: unknown): value is EditorOverride {
  return (
    isRecord(value) &&
    isString(value.id) &&
    (isNullish(value.asSidebarPanel) ||
      isBoolean(value.asSidebarPanel) ||
      (isRecord(value.asSidebarPanel) &&
        (isNullish(value.asSidebarPanel.startOpen) ||
          isBoolean(value.asSidebarPanel.startOpen)) &&
        (isNullish(value.asSidebarPanel.placement) ||
          isPlacement(value.asSidebarPanel.placement)))) &&
    (isNullish(value.parameters) || isRecord(value.parameters)) &&
    (isNullish(value.rank) || isNumber(value.rank)) &&
    (isNullish(value.initialHeight) || isNumber(value.initialHeight))
  );
}

export function isAddonOverride(value: unknown): value is AddonOverride {
  return (
    isRecord(value) &&
    isString(value.id) &&
    (isNullish(value.parameters) || isRecord(value.parameters)) &&
    (isNullish(value.rank) || isNumber(value.rank)) &&
    (isNullish(value.initialHeight) || isNumber(value.initialHeight))
  );
}

export function isReturnTypeOfOverrideFieldExtensionsHook(
  value: unknown,
): value is FieldExtensionOverride | undefined {
  return isNullish(value) || isFieldExtensionOverride(value);
}
