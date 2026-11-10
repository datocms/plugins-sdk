import React, { useState } from 'react';
import { Authentication } from '../../icons/index';
import Button from '../actions/Button';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { useFieldInput } from './FieldWrapper';
import { BaseInputComponentPropsField } from './inputProps';
import { useTextInputHandlers } from './useTextInputHandlers';

/**
 * The props of `PasswordInput`: the contract of an input, and the
 * attributes of an `input` element (`autoComplete`, `onFocus`, ...).
 */
export type PasswordInputProps = BaseInputComponentPropsField<string | null> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'disabled'
    | 'placeholder'
    | 'type'
  > & {
    /**
     * The text that shows when the input is empty (a plain string or
     * `{ id }`). `null` is the same as no text.
     */
    placeholder?: TextMessage | null;
  };

/**
 * A password input with a button that shows or hides the password. It passes
 * the attributes of an `input` element to the `input`.
 */
const PasswordInput = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  ...inputProps
}: PasswordInputProps) => {
  const { tm } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handlers = useTextInputHandlers<HTMLInputElement>({
    value,
    onChange,
    onBlur,
    onFocus,
  });
  const fieldProps = useFieldInput(inputProps);

  return (
    <div className="PasswordInput">
      <input
        {...inputProps}
        {...fieldProps}
        {...handlers}
        value={value || ''}
        placeholder={placeholder ? tm(placeholder) : undefined}
        type={showPassword ? 'text' : 'password'}
      />
      <Button
        tone="ghost"
        size="micro"
        iconOnly
        icon={
          showPassword
            ? Authentication.HidePasswordIcon
            : Authentication.ShowPasswordIcon
        }
        label={{
          id: showPassword ? 'form.password.hide' : 'form.password.show',
        }}
        className="PasswordInput__toggle"
        onClick={() => setShowPassword((visible) => !visible)}
      />
    </div>
  );
};

export default React.memo(PasswordInput);
