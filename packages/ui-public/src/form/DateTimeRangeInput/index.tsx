import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { Generic, Status } from '../../../icons/index';
import Button from '../../actions/Button';
import { Dropdown } from '../../actions/Dropdown';
import DropdownTriggerButton from '../../actions/Dropdown/triggers/DropdownTriggerButton';
import { type DropdownTriggerBaseProps } from '../../actions/Dropdown/triggers/types';
import { useDateSettings } from '../../content/DateSettings';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';
import Popover, { type PopoverProps } from '../../overlays/Popover';
import RawButton from '../../semantic/RawButton';
import {
  CALENDAR_FOCUS_TARGET,
  type SelectableDays,
} from '../DateTimeInput/CalendarGrid';
import FieldWrapper, {
  type FieldInputProps,
  useFieldInput,
} from '../FieldWrapper';
import { getEditState } from '../getEditState';
import { type BaseInputComponentPropsFieldWithReadOnly } from '../inputProps';
import Panel, { type RangeEnds } from './Panel';
import { formatRangeEnds } from './rangeLabel';

export type { SelectableDays } from '../DateTimeInput/CalendarGrid';

/** An option of the menu: a range that your code computes, for example "Last 7 days" */
export type DateTimeRangePreset = {
  /** The key of the preset. It goes in the `preset` of the value. */
  value: string;
  /** The text of the option, and of the trigger when the preset is the value */
  label: TextMessage;
};

/** The presets of the menu, and the preset that the clear button sets */
export type DateTimeRangePresets = {
  /**
   * The ranges of the menu, in their order. "Custom range" comes after
   * them.
   */
  options: DateTimeRangePreset[];
  /**
   * The `value` of the preset that the clear button of a custom range sets.
   * Without it, the clear button sets the first option.
   */
  default?: string;
};

/** The value of `DateTimeRangeInput`: a preset, or a custom range */
export type DateTimeRangeValue =
  /** A preset of the menu, as its `value` */
  | { preset: string; start?: never; end?: never }
  /**
   * A custom range. Each end is an ISO 8601 date and time with the offset
   * of the time zone of the project, for example
   * `"2026-11-03T00:00:00+01:00"`, or `null` for no limit on that side. The
   * input accepts any ISO 8601 string as an end.
   */
  | { preset?: never; start: string | null; end: string | null };

/** The look of the input, and the props that only one look has */
export type DateTimeRangeInputVariant =
  /** A trigger with the look of a field */
  | {
      /**
       * The look of the trigger. "default" has the look of a field. "filter"
       * has no border and a small text, for the value of a filter.
       * @default 'default'
       */
      variant?: 'default';
      /**
       * Shows a button that sets the value back to the default preset (see
       * `presets`), or to an empty range when there are no presets.
       * @default true
       */
      clearable?: boolean;
      /**
       * The trigger is as wide as its text, not as wide as its container.
       * @default false
       */
      autosize?: boolean;
    }
  /**
   * The value of a filter: no border, no clear button, a small text. The
   * trigger is as wide as its text.
   */
  | { variant: 'filter'; clearable?: never; autosize?: never };

/** The props of `DateTimeRangeInput` */
export type DateTimeRangeInputProps =
  BaseInputComponentPropsFieldWithReadOnly<DateTimeRangeValue> &
    Omit<FieldInputProps, 'id'> &
    DateTimeRangeInputVariant & {
      /**
       * The ranges of the menu, and the preset that the clear button sets.
       * Without presets, the trigger opens the custom range directly.
       */
      presets?: DateTimeRangePresets;
      /**
       * The text of the trigger when the custom range has no ends.
       * @default "Custom range"
       */
      placeholder?: TextMessage;
      /**
       * The accessible name of the input. Give it when the input is not in a
       * `FieldWrapper` with a `label`.
       */
      ariaLabel?: TextMessage;
      /**
       * When the custom range shows the time zone menu. "always" shows it.
       * "whenDifferent" shows it only when the time zone of the user is not
       * the time zone of the project.
       * @default 'always'
       */
      timezoneSelect?: 'always' | 'whenDifferent';
      /**
       * The side of the input where the custom range opens. It moves to the
       * other side when there is no space.
       * @default 'bottom-start'
       */
      calendarPlacement?: PopoverProps['placement'];
      /**
       * The days that the user can pick in the calendar. "future" is today
       * and the days after it. "past" is today and the days before it, for
       * a range of past events. The calendar disables the other days. The
       * user can still type a date out of the limit: check the value in your
       * code.
       * @default 'all'
       */
      selectableDays?: SelectableDays;
    };

const EMPTY_RANGE: RangeEnds = { start: null, end: null };
const NO_PRESETS: DateTimeRangePreset[] = [];

type TriggerContentProps = {
  label: string;
  chevron: boolean;
};

function TriggerContent({ label, chevron }: TriggerContentProps) {
  return (
    <>
      <Status.ClockIcon className="DateTimeRangeInput__trigger-icon" />
      <span className="DateTimeRangeInput__trigger-label">{label}</span>
      {chevron && <MenuChevron />}
    </>
  );
}

const PresetTrigger = React.memo(function PresetTrigger({
  open,
  onTrigger,
  disabled,
  ...content
}: DropdownTriggerBaseProps &
  TriggerContentProps & {
    disabled: boolean;
  }) {
  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className="DateTimeRangeInput__trigger"
      disabled={disabled}
    >
      <TriggerContent {...content} />
    </DropdownTriggerButton>
  );
});

/**
 * An input for a range of dates and times, for example the time range of a
 * log. The trigger opens a menu with your presets and "Custom range", which
 * opens a calendar with the two ends of the range.
 */
export default function DateTimeRangeInput({
  value,
  onChange,
  onBlur,
  disabled: disabledProp,
  readOnly,
  presets: presetsProp,
  placeholder,
  ariaLabel,
  timezoneSelect = 'always',
  variant = 'default',
  clearable = true,
  calendarPlacement = 'bottom-start',
  selectableDays = 'all',
  autosize = false,
  id,
  name,
  ...ariaProps
}: DateTimeRangeInputProps) {
  const { t, tm } = useTranslation();
  const field = useFieldInput({ id, ...ariaProps });
  const { locked, stateClass } = getEditState({
    disabled: disabledProp,
    readOnly,
  });
  const {
    locale,
    twentyFourHour,
    timezone: userTimezone,
    projectTimezone,
  } = useDateSettings();

  const [timezone, setTimezone] = useState(userTimezone);
  const [panelOpen, setPanelOpen] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const filter = variant === 'filter';
  const presets = presetsProp?.options ?? NO_PRESETS;
  const defaultPreset = presetsProp?.default ?? presets[0]?.value;
  const isCustom = value.preset === undefined;
  const custom: RangeEnds = isCustom
    ? { start: value.start, end: value.end }
    : EMPTY_RANGE;

  const commit = (newValue: DateTimeRangeValue) => {
    onChange?.(newValue);
    onBlur?.(newValue);
  };

  const triggerLabel = (() => {
    if (!isCustom) {
      const preset = presets.find((p) => p.value === value.preset);
      return preset ? tm(preset.label) : value.preset;
    }

    if (!custom.start && !custom.end) {
      return placeholder ? tm(placeholder) : t('dateTimeRangeInput.custom');
    }

    const ends = formatRangeEnds(
      custom.start ? new Date(custom.start) : null,
      custom.end ? new Date(custom.end) : null,
      { locale, timezone, twentyFourHour },
    );

    return ends.kind === 'both'
      ? ends.text
      : t(
          ends.kind === 'start'
            ? 'dateTimeRangeInput.from'
            : 'dateTimeRangeInput.until',
          { date: ends.text },
        );
  })();

  // The focus goes back to the trigger only when it is in the panel. A
  // click out of the panel keeps the focus where the user clicked.
  const closePanel = useCallback(() => {
    const focusInPanel = Boolean(
      panelRef.current?.contains(document.activeElement),
    );

    setPanelOpen(false);

    if (focusInPanel) {
      rootElement
        ?.querySelector<HTMLElement>('.DateTimeRangeInput__trigger')
        ?.focus();
    }
  }, [rootElement]);

  const handleApply = (range: RangeEnds) => {
    commit(range);
    closePanel();
  };

  const clearValue = () =>
    commit(defaultPreset ? { preset: defaultPreset } : EMPTY_RANGE);

  const showsClear =
    !filter &&
    clearable &&
    !locked &&
    isCustom &&
    (presets.length > 0 || Boolean(custom.start || custom.end));

  const valueTimezone = projectTimezone ?? userTimezone;
  const showsTimezone =
    timezoneSelect === 'always' || valueTimezone !== userTimezone;

  const chevron = !showsClear;

  return (
    <div
      ref={setRootElement}
      role="group"
      id={field.id}
      aria-label={ariaLabel ? tm(ariaLabel) : undefined}
      aria-labelledby={ariaLabel ? undefined : field['aria-labelledby']}
      aria-describedby={field['aria-describedby']}
      className={classNames('DateTimeRangeInput', stateClass, {
        'DateTimeRangeInput--filter': filter,
        'DateTimeRangeInput--autosize': autosize || filter,
        'DateTimeRangeInput--clearable': showsClear,
      })}
    >
      <FieldWrapper.Boundary>
        {name && (
          <input type="hidden" name={name} value={JSON.stringify(value)} />
        )}
        {presets.length > 0 ? (
          <Dropdown
            className="DateTimeRangeInput__dropdown"
            triggerComponent={PresetTrigger}
            label={triggerLabel}
            chevron={chevron}
            disabled={locked}
          >
            <Dropdown.Menu>
              {presets.map((preset) => (
                <Dropdown.Option
                  key={preset.value}
                  active={value.preset === preset.value}
                  onPick={() => {
                    // The panel follows the trigger, so a click on the
                    // trigger does not close it: a preset closes it.
                    setPanelOpen(false);
                    commit({ preset: preset.value });
                  }}
                >
                  {tm(preset.label)}
                </Dropdown.Option>
              ))}
              <Dropdown.Separator />
              <Dropdown.Option
                active={isCustom}
                onPick={() => setPanelOpen(true)}
              >
                {t('dateTimeRangeInput.custom')}
              </Dropdown.Option>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <RawButton
            className="DateTimeRangeInput__trigger"
            disabled={locked}
            haspopup="dialog"
            expandable={{ open: panelOpen }}
            onClick={() => (panelOpen ? closePanel() : setPanelOpen(true))}
          >
            <TriggerContent label={triggerLabel} chevron={chevron} />
          </RawButton>
        )}
        {/* A button cannot be in a button, so the clear button is a sibling
            of the trigger, over its right end */}
        {showsClear && (
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={Generic.CloseIcon}
            label={t('field.clearValue')}
            className="DateTimeRangeInput__clear"
            onClick={clearValue}
          />
        )}
        {panelOpen && rootElement && (
          <Popover
            anchorElement={rootElement}
            placement={calendarPlacement}
            offset={4}
            onClose={closePanel}
            ariaLabel={{ id: 'dateTimeRangeInput.custom' }}
            autoFocus={CALENDAR_FOCUS_TARGET}
          >
            <div ref={panelRef}>
              <Panel
                initial={custom}
                timezone={timezone}
                valueTimezone={valueTimezone}
                showsTimezone={showsTimezone}
                onTimezoneChange={setTimezone}
                selectableDays={selectableDays}
                onApply={handleApply}
              />
            </div>
          </Popover>
        )}
      </FieldWrapper.Boundary>
    </div>
  );
}
