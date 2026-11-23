import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { type FieldInputProps, useFieldInput } from './FieldWrapper';
import { BaseInputComponentPropsField } from './inputProps';

/**
 * The props of `RangeInput`. The value is a number from `min` to `max`. With
 * a `null` value, the thumb is at `min`.
 */
export type RangeInputProps = BaseInputComponentPropsField<number | null> &
  Omit<FieldInputProps, 'id'> & {
    /**
     * The lowest value, at the start of the track.
     * @default 0
     */
    min?: number;
    /**
     * The highest value, at the end of the track.
     * @default 100
     */
    max?: number;
    /**
     * The distance between two values that the user can pick. An arrow key
     * moves the thumb by one step.
     * @default 1
     */
    step?: number;
    /**
     * The accessible name of the slider. Give it when the input is not in a
     * `FieldWrapper` with a `label`.
     */
    ariaLabel?: TextMessage;
  };

/**
 * A slider for a number in a range. `onChange` gets the new value on each
 * move, so you can show the result while the user drags.
 */
function RangeInput({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  ariaLabel,
  ...ariaProps
}: RangeInputProps) {
  const { tm } = useTranslation();
  const fieldProps = useFieldInput(ariaProps);
  const shownValue = value ?? min;

  return (
    <input
      {...fieldProps}
      name={name}
      aria-label={ariaLabel ? tm(ariaLabel) : undefined}
      type="range"
      className={classNames('RangeInput', disabled && 'is-disabled')}
      // The CSS paints the track up to the thumb (see _RangeInput.css)
      style={
        {
          '--RangeInput-value':
            max > min ? (shownValue - min) / (max - min) : 0,
        } as React.CSSProperties
      }
      min={min}
      max={max}
      step={step}
      value={shownValue}
      disabled={disabled}
      onChange={(event) => onChange?.(Number(event.target.value))}
      onBlur={() => onBlur?.(value)}
    />
  );
}

export default React.memo(RangeInput);
