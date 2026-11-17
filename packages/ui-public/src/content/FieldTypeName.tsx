import React, { useCallback } from 'react';
import { useTranslation } from '../i18n';
import { type FieldType, fieldTypeMessage } from '../utils/fieldTypes';

export type FieldTypeNameProps = {
  /** The `field_type` of the field, as the CMA gives it, for example `"rich_text"` */
  fieldType: FieldType | (string & {});
};

/**
 * Gives a function that returns the name of a field type as a string, in
 * the language of the user. Use it when the name is a part of a string, for
 * example the text of a tooltip. In JSX, use `FieldTypeName`. A type that
 * the function does not know gives its `field_type` string.
 */
export function useFieldTypeName(): (
  fieldType: FieldType | (string & {}),
) => string {
  const { tm } = useTranslation();

  return useCallback((fieldType) => tm(fieldTypeMessage(fieldType)), [tm]);
}

/**
 * The name of a field type as text, in the language of the user. A type
 * that the component does not know shows its `field_type` string.
 */
function FieldTypeName({ fieldType }: FieldTypeNameProps) {
  const fieldTypeName = useFieldTypeName();

  return <>{fieldTypeName(fieldType)}</>;
}

export default FieldTypeName;
