import type { SchemaTypes } from '@datocms/cma-client';
import { BlockNodeTypeWithCustomStyle } from 'datocms-structured-text-utils';
import { Ctx } from '../ctx/base';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

export type CustomBlockStylesForStructuredTextFieldHook = {
  /**
   * Use this function to define a number of custom block styles for a specific
   * Structured Text field
   *
   * @tag structuredText
   */
  customBlockStylesForStructuredTextField: (
    field: Field,
    ctx: CustomBlockStylesForStructuredTextFieldCtx,
  ) => StructuredTextCustomBlockStyle[] | undefined;
};

export type CustomBlockStylesForStructuredTextFieldCtx = Ctx<{
  itemType: ItemType;
}>;

/** An object expressing a custom block style for a Structured Text field */
export type StructuredTextCustomBlockStyle = {
  /** ID of custom block style */
  id: string;
  /** The block node that can apply this style */
  node: BlockNodeTypeWithCustomStyle;
  /** ID of custom block style */
  label: string;
  /** How the block will be styled inside the editor to represent the style */
  appliedStyle: React.CSSProperties;
  /**
   * Custom styles for a block node will be sorted by ascending `rank`. If you
   * want to specify an explicit value for `rank`, make sure to offer a way for
   * final users to customize it inside the plugin's settings form, otherwise
   * the hardcoded value you choose might clash with the one of another plugin!
   */
  rank?: number;
};
