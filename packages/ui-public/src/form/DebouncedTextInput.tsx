import React, { useCallback, useEffect, useState } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useDidUpdateEffect } from '../hooks/useDidUpdateEffect';
import { useTranslation } from '../i18n';
import AutosizeInput from './AutosizeInput';
import { BaseInputComponentPropsField } from './inputProps';
import StringInput, { StringInputProps } from './StringInput';

/** The time that the input waits after the last change before it changes the form */
const DEBOUNCE_DELAY_MS = 1000;

/** The props of `DebouncedTextInput`: the props of `StringInput`, and one more. */
export type DebouncedTextInputProps = StringInputProps & {
  /**
   * Makes the input as wide as its text (or its placeholder), with
   * `AutosizeInput`.
   * @default false
   */
  autosize?: boolean;
};

const DebouncedTextInput = ({
  value: rawValue,
  onChange: rawOnChange,
  onBlur: rawOnBlur,
  name,
  disabled,
  autosize,
  placeholder,
  style,
  ...otherProps
}: DebouncedTextInputProps) => {
  const { tm } = useTranslation();
  const placeholderText = placeholder ? tm(placeholder) : null;
  const externalValue = rawValue || '';

  const [value, setValue] = useState(externalValue);
  const debouncedValue = useDebouncedValue(value, DEBOUNCE_DELAY_MS);

  useEffect(() => {
    setValue(externalValue);
  }, [externalValue]);

  useDidUpdateEffect(() => {
    rawOnChange?.(debouncedValue || null);
  }, [debouncedValue]);

  const onChange = useCallback((newValue: string | null) => {
    setValue(newValue || '');
  }, []);

  const onBlur = useCallback(
    (newValue: string | null) => {
      rawOnBlur?.(newValue);
    },
    [rawOnBlur],
  );

  // Ternary preserves discriminated union: TS knows which variant we're constructing
  const fieldProps: BaseInputComponentPropsField<string | null> =
    disabled === true
      ? { value, disabled: true }
      : { name, value, onChange, onBlur, disabled };

  const input = (
    <StringInput
      {...fieldProps}
      {...otherProps}
      placeholder={placeholderText}
      style={style}
    />
  );

  return autosize ? (
    <AutosizeInput text={value} placeholder={placeholderText}>
      {input}
    </AutosizeInput>
  ) : (
    input
  );
};

export default React.memo(DebouncedTextInput);
