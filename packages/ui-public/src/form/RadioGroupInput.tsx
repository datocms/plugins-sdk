import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useAutoincrementIntegerId } from '../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import Tooltip from '../overlays/Tooltip';
import { type FieldInputProps, useFieldInput } from './FieldWrapper';
import { getEditState } from './getEditState';
import { type BaseInputComponentPropsFieldWithReadOnly } from './inputProps';

/** One option of a radio group */
export type RadioGroupOption<T extends string = string> = {
  /** The value that the form gets when the user picks this option */
  value: T;
  /** The text of the option */
  label: Message;
  /** A short help text under the label */
  hint?: Message | null;
  /** A tooltip for the option, for example the reason why it is disabled */
  tooltip?: TextMessage | null;
  /** Tells that the user cannot pick this option */
  disabled?: boolean;
  /**
   * An icon or a logo before the text, for an option that stands for a
   * service or a place (a hosting provider, the machine of the user). Give it
   * to all the options of the group, or to none.
   */
  icon?: React.ReactNode;
  /**
   * An extra class for a mark of the caller on this option, for example the
   * diff of two versions marks the options that changed
   */
  className?: string;
};

/** The props of `RadioGroupInput` */
export type RadioGroupInputProps<T extends string = string> =
  BaseInputComponentPropsFieldWithReadOnly<T | null> &
    Omit<FieldInputProps, 'id'> & {
      /** The options of the group. To let the user pick no value, add an option for it. */
      options: readonly RadioGroupOption<T>[];
      /** A group with a smaller gap and smaller text */
      small?: boolean;
    };

/**
 * A choice of one value from a list of options, all visible, each with a
 * label and an optional hint. For a boolean value, the caller maps `true`
 * and `false` to two string values.
 */
function RadioGroupInput<T extends string>(props: RadioGroupInputProps<T>) {
  const { name, options, value, onChange, onBlur, small, disabled, readOnly } =
    props;
  const { tm, tc } = useTranslation();
  // The group element takes the field: the radios in it have their own labels
  const field = useFieldInput(props);
  const uid = useAutoincrementIntegerId();
  const inputId = field.id ?? name ?? `RadioGroupInput-${uid}`;

  // A pick is a finished edit: the field is touched and checked at once.
  const handlePick = useCallback(
    (picked: T) => {
      onChange?.(picked);
      onBlur?.(picked);
    },
    [onChange, onBlur],
  );

  return (
    // The radios share a name, thus the browser gives the group one tab stop
    // and the arrow keys move between the options. A read-only group has the
    // look of a normal group, and the keyboard can move to it, but its value
    // does not change.
    <div
      id={inputId}
      className={classNames('RadioGroupInput', small && 'is-small')}
      role="radiogroup"
      aria-labelledby={field['aria-labelledby']}
      aria-describedby={field['aria-describedby']}
      aria-invalid={field['aria-invalid']}
      aria-required={field['aria-required']}
      aria-readonly={
        getEditState({ disabled, readOnly }).showsReadOnly || undefined
      }
    >
      {options.map((option) => {
        const checked = option.value === value;
        const optionId = `${inputId}-${option.value}`;
        const editState = getEditState({
          disabled: disabled || option.disabled,
          readOnly,
        });

        return (
          <Tooltip
            key={option.value}
            label={option.tooltip ? tm(option.tooltip) : undefined}
          >
            <label
              htmlFor={optionId}
              className={classNames(
                'RadioGroupInput__option',
                checked && 'is-checked',
                editState.stateClass,
                option.className,
              )}
            >
              <div className="RadioGroupInput__radio">
                <input
                  type="radio"
                  name={inputId}
                  value={option.value}
                  id={optionId}
                  onChange={
                    editState.locked
                      ? undefined
                      : () => handlePick(option.value)
                  }
                  disabled={editState.disabled}
                  readOnly={editState.showsReadOnly}
                  checked={checked}
                />
              </div>
              <div className="RadioGroupInput__body">
                <div className="RadioGroupInput__label">{tc(option.label)}</div>
                {option.hint && (
                  <div className="RadioGroupInput__hint">{tc(option.hint)}</div>
                )}
              </div>
              {option.icon && (
                <div className="RadioGroupInput__icon" aria-hidden="true">
                  {option.icon}
                </div>
              )}
            </label>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default RadioGroupInput;
