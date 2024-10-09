import type { SchemaTypes } from '@datocms/cma-client';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

/**
 * These information describe the current state of the field where this plugin
 * is applied to.
 */
export type FieldAdditionalProperties = {
  /** Whether the field is currently disabled or not */
  disabled: boolean;
  /**
   * The path in the `formValues` object where to find the current value for the
   * field
   */
  fieldPath: string;
  /** The field where the field extension is installed to */
  field: Field;
  /**
   * If the field extension is installed in a field of a block, returns the top
   * level Modular Content/Structured Text field containing the block itself
   */
  parentField: Field | undefined;
  /**
   * If the field extension is installed in a field of a block, returns the ID
   * of the block — or `undefined` if the block is still not persisted — and the
   * block model.
   */
  block: undefined | { id: string | undefined; blockModel: ItemType };
};
