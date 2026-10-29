import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { useFieldInput } from './FieldWrapper';
import { BaseInputComponentPropsField } from './inputProps';
import { useTextInputHandlers } from './useTextInputHandlers';

/**
 * The props of `StringInput`: the contract of an input, and the attributes of
 * an `input` element (`autoComplete`, `maxLength`, `type`, ...).
 */
export type StringInputProps = BaseInputComponentPropsField<string | null> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'onBlur' | 'name' | 'disabled' | 'placeholder'
  > & {
    /**
     * The text that shows when the input is empty (a plain string or
     * `{ id }`). `null` is the same as no text.
     * @example "Marketing site"
     */
    placeholder?: TextMessage | null;
    /**
     * Shows the value in the monospaced font, for a value that is code: a
     * pattern, a URL, an API key.
     * @default false
     */
    code?: boolean;
  };

const StringInput = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  code,
  className,
  ...other
}: StringInputProps) => {
  const { tm } = useTranslation();
  const handlers = useTextInputHandlers<HTMLInputElement>({
    value,
    onChange,
    onBlur,
    onFocus,
  });
  const fieldProps = useFieldInput(other);

  return (
    <input
      type="text"
      {...other}
      {...fieldProps}
      {...handlers}
      className={
        classNames(className, code && 'form__input--code') || undefined
      }
      value={value || ''}
      placeholder={placeholder ? tm(placeholder) : undefined}
    />
  );
};

export default React.memo(StringInput);
