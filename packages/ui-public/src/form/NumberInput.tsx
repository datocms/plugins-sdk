import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { useFieldInput } from './FieldWrapper';
import { BaseInputComponentPropsField } from './inputProps';

/**
 * The props of `NumberInput`: the contract of an input, and the attributes of
 * an `input` element (`autoComplete`, ...).
 */
export type NumberInputProps = BaseInputComponentPropsField<number | null> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'disabled'
    | 'placeholder'
    | 'type'
    | 'inputMode'
  > & {
    /**
     * The keyboard that a touch device shows: "numeric" for an integer,
     * "decimal" for a number with a decimal point.
     * @default 'decimal'
     */
    inputMode?: 'numeric' | 'decimal';
    /**
     * The text that shows when the input is empty (a plain string or
     * `{ id }`).
     * @example "0"
     */
    placeholder?: TextMessage | null;
  };

const COMPLETE_NUMBER = /^-?\d+(\.\d+)?$/;

/**
 * Reads the text of the input. It returns `null` for an empty text, the
 * number for a complete number, and `undefined` for a text that is not a
 * complete number ("-", "1.", "abc").
 */
function parse(text: string): number | null | undefined {
  const trimmed = text.trim();

  if (trimmed === '') {
    return null;
  }

  return COMPLETE_NUMBER.test(trimmed) ? Number(trimmed) : undefined;
}

function format(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value);
}

const NumberInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  inputMode = 'decimal',
  ...other
}: NumberInputProps) => {
  const { tm } = useTranslation();
  const fieldProps = useFieldInput(other);
  // The input keeps the text that the user types. The form gets only
  // numbers and null: a text that is not a complete number does not change
  // the value of the form.
  const [text, setText] = useState(() => format(value));
  const textRef = useRef(text);
  textRef.current = text;

  // A value that comes from the form replaces the text, unless the text
  // already shows that value.
  useEffect(() => {
    if (parse(textRef.current) !== (value ?? null)) {
      setText(format(value));
    }
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value;
      const newValue = parse(newText);

      setText(newText);

      if (newValue !== undefined && newValue !== (value ?? null)) {
        onChange?.(newValue);
      }
    },
    [value, onChange],
  );

  // On blur, a text that is not a complete number goes back to the value
  // of the form.
  const handleBlur = useCallback(() => {
    const parsed = parse(textRef.current);
    const finalValue = parsed === undefined ? (value ?? null) : parsed;

    setText(format(finalValue));
    onBlur?.(finalValue);
  }, [value, onBlur]);

  return (
    <input
      {...other}
      {...fieldProps}
      type="text"
      inputMode={inputMode}
      placeholder={placeholder ? tm(placeholder) : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      value={text}
    />
  );
};

export default React.memo(NumberInput);
