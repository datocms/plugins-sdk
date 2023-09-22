import React, { useCallback, RefObject, ChangeEvent } from 'react';
import cn from 'classnames';
import s from './styles.module.css.json';

export type TextareaInputChangeEventHandler = (
  newValue: string,
  event: React.ChangeEvent<HTMLTextAreaElement>,
) => void;

export type TextareaInputProps = {
  name?: string;
  labelText?: string;
  id?: string;
  className?: string;
  monospaced?: boolean;
  onChange?: TextareaInputChangeEventHandler;
  inputRef?: RefObject<HTMLTextAreaElement>;
  error?: boolean;
} & Omit<JSX.IntrinsicElements['textarea'], 'onChange'>;

export const TextareaInput = ({
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
  value,
  monospaced,
  ...otherProps
}: TextareaInputProps): JSX.Element => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value, e);
      }
    },
    [onChange],
  );

  const classNames = cn(s['TextareaInput'], className, {
    [s['TextareaInput--disabled']]: disabled,
    [s['TextareaInput--error']]: error,
    [s['TextareaInput--monospaced']]: monospaced,
  });

  return (
    <textarea
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
      ref={inputRef}
      {...otherProps}
    />
  );
};
