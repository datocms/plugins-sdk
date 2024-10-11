import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import {
  isArray,
  isNullish,
  isNumber,
  isPlacement,
  isRecord,
  isString,
} from '../guardUtils.js';
import { Icon, isIcon } from '../icon';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

export type CustomMarksForStructuredTextFieldHook = {
  /**
   * Use this function to define a number of custom marks for a specific
   * Structured Text field
   *
   * @tag structuredText
   */
  customMarksForStructuredTextField: (
    field: Field,
    ctx: CustomMarksForStructuredTextFieldCtx,
  ) => StructuredTextCustomMark[] | undefined;
};

export type CustomMarksForStructuredTextFieldCtx = Ctx<{
  itemType: ItemType;
}>;

/**
 * An object expressing a custom mark for a Structured Text field
 *
 * @see {isStructuredTextCustomMark}
 */
export type StructuredTextCustomMark = {
  /** ID of mark */
  id: string;
  /** Label representing the custom mark */
  label: string;
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible
   */
  icon: Icon;
  /**
   * Expresses where you want the custom mark button to be placed inside the
   * toolbar. If not specified, the item will be placed after the standard marks
   * provided by DatoCMS itself.
   */
  placement?: StructuredTextCustomMarkPlacement;
  /**
   * If multiple custom marks specify the same `placement` for their toolbar
   * button, they will be sorted by ascending `rank`. If you want to specify an
   * explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
  /**
   * Keyboard shortcut associated with the custom mark, expressed using the
   * https://github.com/ianstormtaylor/is-hotkey syntax (ie. `mod+shift+x`)
   */
  keyboardShortcut?: string;
  /** How the custom mark will be styled inside the editor */
  appliedStyle: React.CSSProperties;
};

export type StructuredTextCustomMarkPlacement = [
  'before' | 'after',
  'strong' | 'emphasis' | 'underline' | 'code' | 'highlight' | 'strikethrough',
];

export function isStructuredTextCustomMark(
  value: unknown,
): value is StructuredTextCustomMark {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.label) &&
    isIcon(value.icon) &&
    (isNullish(value.placement) || isPlacement(value.placement)) &&
    (isNullish(value.rank) || isNumber(value.rank)) &&
    (isNullish(value.keyboardShortcut) || isString(value.keyboardShortcut)) &&
    isRecord(value.appliedStyle)
  );
}

export function isReturnTypeOfCustomMarksForStructuredTextFieldHook(
  value: unknown,
): value is StructuredTextCustomMark[] | undefined {
  return isNullish(value) || isArray(value, isStructuredTextCustomMark);
}
