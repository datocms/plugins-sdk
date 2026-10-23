import classNames from 'classnames';
import React from 'react';
import { type ButtonSize, useButtonSize } from '../actions/Button';
import { useRovingKeyDown } from '../hooks/useRovingKeyDown';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import Tooltip from '../overlays/Tooltip';
import RawButton from '../semantic/RawButton';

export type SegmentedControlOption<T extends string> = {
  /** The value that `onChange` gets, for example "grid" */
  value: T;
  /** The text of the option, for example "Grid" */
  label: Message;
  /** An icon before the label */
  icon?: React.ReactNode;
};

/** An option that shows only its icon */
export type SegmentedControlIconOption<T extends string> = {
  /** The value that `onChange` gets, for example "dark" */
  value: T;
  /** The tooltip and the accessible name of the option, for example "Dark" */
  label: TextMessage;
  /** The icon of the option */
  icon: React.ReactNode;
};

/** The look of the options: a text, or only an icon with a tooltip */
export type SegmentedControlOptions<T extends string> =
  /** Each option shows its label, with an optional icon before it */
  | {
      options: readonly SegmentedControlOption<T>[];
      iconOnly?: false;
    }
  /** Each option shows only its icon. The label goes in a tooltip. */
  | {
      options: readonly SegmentedControlIconOption<T>[];
      iconOnly: true;
    };

/** The accessible name of the group: a text, or the id of a visible label */
export type SegmentedControlName =
  /** A text, for example "Layout", when no visible label names the group */
  | { ariaLabel: TextMessage; ariaLabelledBy?: never }
  /** The id of a visible label, for example the label of a Field */
  | { ariaLabelledBy: string; ariaLabel?: never };

export type SegmentedControlProps<T extends string> = SegmentedControlName &
  SegmentedControlOptions<T> & {
    /** The `value` of the selected option */
    value: T;
    /** Runs when the user picks another option */
    onChange: (value: T) => void;
    /**
     * The height of the options, with the padding of the Button sizes. The
     * size of the place by default: "milli" in a toolbar, "field" in a
     * toolbar of fields, "small" out of a toolbar (see useButtonSize).
     */
    size?: ButtonSize;
    /** The control takes the full width, and the options share it equally */
    fill?: boolean;
    /** Turns off all the options */
    disabled?: boolean;
    /** Only for the place of the control (margin), not for its look */
    className?: string;
  };

/**
 * A choice of one value from a few options, always visible. It applies at
 * once, with no confirm. The group is one tab stop: the arrow keys, Home and
 * End move the focus and select the option, as in a native radio group.
 */
function SegmentedControl<T extends string>({
  options,
  iconOnly,
  value,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  size,
  fill,
  disabled,
  className,
}: SegmentedControlProps<T>) {
  const { tm, tc } = useTranslation();
  const placeSize = useButtonSize();
  const handleKeyDown = useRovingKeyDown('[role="radio"]', true);
  // When no option has the value, the first option is the tab stop.
  const hasSelection = options.some((option) => option.value === value);

  return (
    <div
      className={classNames(
        'SegmentedControl',
        `SegmentedControl--${size ?? placeSize}`,
        {
          'SegmentedControl--fill': fill,
          'SegmentedControl--icon-only': iconOnly,
        },
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel ? tm(ariaLabel) : undefined}
      aria-labelledby={ariaLabelledBy}
      onKeyDown={handleKeyDown}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const buttonProps = {
          radio: { checked: isSelected },
          tabIndex: isSelected || (!hasSelection && index === 0) ? 0 : -1,
          className: classNames('SegmentedControl__button', {
            'is-selected': isSelected,
          }),
          disabled,
          onClick: () => !isSelected && onChange(option.value),
        };

        if (iconOnly) {
          const labelText = tm(option.label as TextMessage);

          return (
            <Tooltip key={option.value} label={labelText}>
              <RawButton {...buttonProps} ariaLabel={labelText}>
                {option.icon}
              </RawButton>
            </Tooltip>
          );
        }

        return (
          <RawButton key={option.value} {...buttonProps}>
            {option.icon}
            {tc(option.label)}
          </RawButton>
        );
      })}
    </div>
  );
}

export default React.memo(SegmentedControl) as typeof SegmentedControl;
