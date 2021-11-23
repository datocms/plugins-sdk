import React, { useCallback, RefObject, ChangeEvent } from 'react';
import cn from 'classnames';
import s from './styles.module.css.json';

export type TextInputChangeEventHandler = (
  newValue: string,
  event: React.ChangeEvent<HTMLInputElement>,
) => void;

export type TextInputProps = {
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'url'
    | 'date'
    | 'time';
  name?: string;
  labelText?: string;
  id?: string;
  className?: string;
  onChange?: TextInputChangeEventHandler;
  inputRef?: RefObject<HTMLInputElement>;
  error?: boolean;
} & Omit<JSX.IntrinsicElements['input'], 'onChange'>;

export const TextInput = ({
  className,
  disabled = false,
  error,
  id,
  inputRef,
  maxLength,
  name,
  labelText,
  onBlur,
  onChange,
  placeholder,
  required = false,
  type,
  value,
  ...otherProps
}: TextInputProps): JSX.Element => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value, e);
      }
    },
    [onChange],
  );

  const classNames = cn(s['TextInput'], className, {
    [s['TextInput--disabled']]: disabled,
    [s['TextInput--error']]: error,
  });

  return (
    <input
      className={classNames}
      aria-label={labelText}
      id={id}
      name={name}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      onBlur={onBlur}
      onChange={handleChange}
      value={value}
      type={type}
      ref={inputRef}
      {...otherProps}
    />
  );
};
