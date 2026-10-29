import classNames from 'classnames';
import React, { isValidElement, useCallback } from 'react';
import { useAutoincrementIntegerId } from '../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import { useFieldInput } from './FieldWrapper';
import { getEditState } from './getEditState';
import {
  BaseInputComponentPropsFieldWithReadOnly,
  type FieldInputStatics,
} from './inputProps';
import { useInSwitchList } from './SwitchList';

/** The props of `SwitchInput`. */
export type SwitchInputProps = BaseInputComponentPropsFieldWithReadOnly<
  boolean | null
> & {
  /**
   * The text next to the switch. It is the name of the switch, and a click
   * on it flips the switch. An element shows as it is: it must be a `Label`
   * that points to the `id` of the switch (`Field` of the apps gives one).
   * Do not give a `label` to a `FieldWrapper` around the switch.
   */
  label: Message;
  /**
   * Another setting forces the value to true, for example a permission that
   * a role gets from another role. An off switch then shows as on and faded,
   * and the reason shows under it (in a `SwitchList`, before the switch).
   * The screen reader reads the reason too.
   */
  forcedOn?: {
    /** Why the value is on, for example "The role Editor gives it" */
    reason: Message;
  };
  /** The `id` of the text of the label. `Field` of the apps gives it. */
  'aria-labelledby'?: string;
  /** Set when the value has an error. A `FieldWrapper` gives it. */
  'aria-invalid'?: boolean;
  /** The `id` of the error and of the hint. A `FieldWrapper` gives it. */
  'aria-describedby'?: string;
  /** Set when the field is required. A `FieldWrapper` gives it. */
  'aria-required'?: boolean;
};

const SwitchInput = React.memo(function SwitchInput(props: SwitchInputProps) {
  const { tc } = useTranslation();
  const { label, value, name, forcedOn, onChange, onBlur } = props;
  // The label of a field can hold a menu button. Its name would join the
  // name of the switch, thus the switch points to the text of the label.
  const {
    id,
    'aria-labelledby': ariaLabelledBy,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    'aria-required': ariaRequired,
  } = useFieldInput(props);
  const uid = useAutoincrementIntegerId();
  // A read-only switch has the look of a normal switch, and the keyboard can
  // move to it, but its value does not change
  const { disabled, showsReadOnly } = getEditState(props);
  const inList = useInSwitchList();

  const checkboxId = id ?? name ?? `SwitchInput-${uid}`;

  // A pick is a finished edit: the field is touched and checked at once.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showsReadOnly) {
        return;
      }
      onChange?.(e.target.checked);
      onBlur?.(e.target.checked);
    },
    [onChange, onBlur, showsReadOnly],
  );

  // A press with the pointer does not move the focus to the checkbox. Thus
  // the focus ring shows only when the user moves to the switch with the
  // keyboard. The click still changes the value.
  const preventFocus = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const showsForcedOn = Boolean(forcedOn && !value);
  const reasonId = `${checkboxId}-forced-reason`;
  const describedBy =
    [ariaDescribedBy, showsForcedOn && reasonId].filter(Boolean).join(' ') ||
    undefined;

  const reasonElement = showsForcedOn && forcedOn && (
    <div
      id={reasonId}
      className={inList ? 'SwitchInput__reason' : 'form__hint'}
    >
      {tc(forcedOn.reason)}
    </div>
  );

  const labelElement = label && (
    <span className="SwitchInput__label">
      {isValidElement(label) ? (
        label
      ) : (
        <label htmlFor={checkboxId} className="form__label">
          <span className="form__label__text">{tc(label)}</span>
        </label>
      )}
    </span>
  );

  // In a SwitchList, the label and the reason come before the switch. The
  // checkbox stays just before the switch, because the CSS of the switch
  // reads the state of the checkbox with the "+" selector.
  return (
    <>
      <div className={classNames('SwitchInput', inList && 'SwitchInput--row')}>
        {inList && labelElement}
        {inList && reasonElement}
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          className="SwitchInput__checkbox"
          checked={value ?? false}
          onChange={handleChange}
          disabled={disabled}
          readOnly={showsReadOnly}
          aria-readonly={showsReadOnly || undefined}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
          aria-required={ariaRequired}
        />
        <label
          htmlFor={checkboxId}
          onMouseDown={preventFocus}
          className={classNames('SwitchInput__switch', {
            'SwitchInput__switch--forced-on': showsForcedOn,
            'SwitchInput__switch--disabled': disabled,
            'SwitchInput__switch--read-only': showsReadOnly,
          })}
        />
        {!inList && labelElement}
      </div>
      {!inList && reasonElement}
    </>
  );
});

export default Object.assign(SwitchInput, {
  fieldLabel: 'inside',
} satisfies FieldInputStatics);
