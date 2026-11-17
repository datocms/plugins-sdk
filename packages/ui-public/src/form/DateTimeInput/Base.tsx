import { TZDate, tzOffset } from '@date-fns/tz';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Generic, UI } from '../../../icons/index';
import Button from '../../actions/Button';
import { useDateSettings } from '../../content/DateSettings';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Popover, { type PopoverProps } from '../../overlays/Popover';
import { timezoneOptions } from '../../utils/timezones';
import AutosizeInput from '../AutosizeInput';
import FieldWrapper, {
  type FieldInputProps,
  useFieldInput,
} from '../FieldWrapper';
import { getEditState } from '../getEditState';
import { BaseInputComponentPropsFieldWithReadOnly } from '../inputProps';
import SelectInput from '../SelectInput';
import CalendarGrid, {
  CALENDAR_FOCUS_TARGET,
  type SelectableDays,
} from './CalendarGrid';
import { parseDateText, timeInputFormats } from './dateText';
import {
  DATE_TIME_VALUE_FORMAT,
  DATE_VALUE_FORMAT,
  formatInstantInTimezone,
} from './value';

export type { SelectableDays } from './CalendarGrid';

type ApplyInputAsWallClockOptions = {
  inputText: string;
  inputFormats: string[];
  inputTimezone: string;
};

/**
 * Creates a TZDate for midnight (00:00) of a 'yyyy-MM-dd' date in an IANA
 * time zone.
 *
 * Example:
 *   createTzMidnight("2025-11-01", "America/Manaus")
 *   → TZDate for 2025-11-01T00:00:00-04:00 (2025-11-01T04:00:00Z)
 */
function createTzMidnight(dateString: string, timeZone: string): TZDate {
  const [year, month, day] = dateString.split('-').map(Number);

  if (
    !year ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  // The months of JS start at zero
  return new TZDate(year, month - 1, day, timeZone);
}

/**
 * Returns a TZDate for 00:00:00 of today in the time zone.
 *
 * Example: at 15:34 of 2025-10-25 in "America/Los_Angeles", it returns
 * 2025-10-25T00:00:00 in "America/Los_Angeles". Its getTime() is the UTC
 * instant of that wall clock.
 */
function tzStartOfDay(timezone: string) {
  const currentTimeInTz = TZDate.tz(timezone);
  return TZDate.tz(
    timezone,
    currentTimeInTz.getFullYear(),
    currentTimeInTz.getMonth(),
    currentTimeInTz.getDate(),
  );
}

/**
 * Parses the text of the user with the first format that matches. Then
 * `copyFn` copies the parsed parts (the day, or the time) as the wall clock
 * of `inputTimezone` onto the base instant. Without a base instant, the base
 * is 00:00 of today in `inputTimezone`. It returns null when no format
 * matches.
 *
 * Example (a time):
 *   base = "2025-10-25T09:00:00.000Z", text = "11:00:00",
 *   inputTimezone = "America/Los_Angeles"
 *   1) "11:00:00" gives a Date with the hours 11 and the minutes 0.
 *   2) The base becomes a TZDate in Los Angeles.
 *   3) copyFn sets 11:00:00 on it: the instant is now 11:00 in Los Angeles.
 */
function applyInputAsWallClock(
  baseInstantISOString: string | null,
  copyFn: (srcDate: Date, dstDate: TZDate) => void,
  { inputText, inputFormats, inputTimezone }: ApplyInputAsWallClockOptions,
): TZDate | null {
  const parsedUserInput = parseDateText(inputText, inputFormats);

  if (!parsedUserInput) return null;

  const modifiableInstanceInInputTz = baseInstantISOString
    ? TZDate.tz(inputTimezone, baseInstantISOString)
    : tzStartOfDay(inputTimezone);

  copyFn(parsedUserInput, modifiableInstanceInInputTz);

  return modifiableInstanceInInputTz;
}

/**
 * The offset of the time zone at the instant, in a short form: "UTC",
 * "UTC+2", "UTC-3:30". The instant is necessary, because the offset changes
 * with daylight saving time.
 */
function shortTimezoneLabel(timezone: string, instant: Date) {
  const minutes = tzOffset(timezone, instant);

  if (minutes === 0) {
    return 'UTC';
  }

  const sign = minutes > 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(minutes) / 60);
  const rest = Math.abs(minutes) % 60;

  return `UTC${sign}${hours}${rest ? `:${String(rest).padStart(2, '0')}` : ''}`;
}

/**
 * The text that sets the width of a date or time input (see AutosizeInput).
 * It has one line for each of these: a sample with the widest digits
 * ("28/12/2026", "08:58:58 PM"), the placeholder (the format), and the text
 * of the user. The width is the width of the longest line. So the input
 * keeps its width when the user sets or clears the value, and the text never
 * gets cut.
 */
const widestSample = new Date(2026, 11, 28, 20, 58, 58);

function sizerText(inputFormat: string, input: string) {
  return [format(widestSample, inputFormat), inputFormat, input].join('\n');
}

/** The look of the input, and the props that only one look has */
export type DateInputVariant =
  /** A field with a border, a calendar button and a clear button */
  | {
      /**
       * The look of the input. "default" is a field with a border and a
       * calendar button. "filter" has no border, no buttons and a small
       * text, for the value of a filter: the calendar opens when the user
       * clicks the date.
       * @default 'default'
       */
      variant?: 'default';
      /**
       * Shows a button that clears the value, when the input has a value.
       * @default true
       */
      clearable?: boolean;
      /**
       * The field is as wide as its content, not as wide as its container.
       * @default false
       */
      autosize?: boolean;
    }
  /**
   * The value of a filter: no border, no buttons, a small text. It is as
   * wide as its content.
   */
  | { variant: 'filter'; clearable?: never; autosize?: never };

/** The props that `DateInput` and `DateTimeInput` share */
export type DateInputCommonProps = BaseInputComponentPropsFieldWithReadOnly<
  string | null
> &
  Omit<FieldInputProps, 'id'> &
  DateInputVariant & {
    /**
     * The accessible name of the date text. Give it when the input is not in
     * a `FieldWrapper` with a `label`.
     */
    ariaLabel?: TextMessage;
    /**
     * The side of the field where the calendar opens. It moves to the other
     * side when there is no space.
     * @default 'bottom-start'
     */
    calendarPlacement?: PopoverProps['placement'];
    /**
     * The days that the user can pick in the calendar. "future" is today and
     * the days after it, "past" is today and the days before it. The
     * calendar disables the other days. The user can still type a date out
     * of the limit: check the value in your code.
     * @default 'all'
     */
    selectableDays?: SelectableDays;
  };

/**
 * The props of `DateTimeInput`. The value is an ISO 8601 date and time with
 * an offset, for example `"2026-11-17T09:30:00+01:00"`, or `null`.
 */
export type DateTimeInputProps = DateInputCommonProps & {
  /**
   * The time has the seconds. Without them, the user types the hours and
   * the minutes, and the seconds of the value are 0.
   * @default true
   */
  seconds?: boolean;
  /**
   * When the field shows the time zone menu. "always" shows it. "whenDifferent"
   * shows it only when the time zone of the user is not the time zone of the
   * project, so the user sees which time zone the time is in.
   * @default 'always'
   */
  timezoneSelect?: 'always' | 'whenDifferent';
};

type DateTimeInputBaseProps = DateTimeInputProps & { withTime: boolean };

/**
 * The input of `DateInput` and of `DateTimeInput`. A date has no time zone:
 * it uses the time zone of the project for the instant of its midnight, and
 * shows the same day.
 */
export default function DateTimeInputBase({
  value,
  onChange,
  onBlur,
  disabled: disabledProp,
  readOnly,
  withTime,
  seconds = true,
  timezoneSelect = 'always',
  variant = 'default',
  clearable = true,
  calendarPlacement = 'bottom-start',
  selectableDays = 'all',
  autosize = false,
  ariaLabel,
  id,
  name,
  ...ariaProps
}: DateTimeInputBaseProps) {
  const { t, tm } = useTranslation();
  const fieldProps = useFieldInput({ id, ...ariaProps });
  const { locked, disabled, showsReadOnly, stateClass } = getEditState({
    disabled: disabledProp,
    readOnly,
  });

  const {
    dateFormat,
    twentyFourHour,
    timezone: userTimezone,
    projectTimezone,
  } = useDateSettings();

  const apiTimezone = projectTimezone ?? userTimezone;
  const filter = variant === 'filter';

  const commit = (newValue: string | null) => {
    onChange?.(newValue);
    onBlur?.(newValue);
  };

  const timeFormats = timeInputFormats(twentyFourHour, seconds);

  const serializationFormat = withTime
    ? DATE_TIME_VALUE_FORMAT
    : DATE_VALUE_FORMAT;

  const timeFormat = timeFormats[0];

  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    withTime ? userTimezone : apiTimezone,
  );

  // The ISO string of the instant of the value, in UTC. A date is the
  // instant of its midnight in the time zone of the project.
  const canonicalInstantISO = value
    ? withTime
      ? new Date(value).toISOString()
      : createTzMidnight(value, apiTimezone).toISOString()
    : null;

  // The texts of the inputs show the instant in the selected time zone
  const formattedDateDisplay = canonicalInstantISO
    ? format(TZDate.tz(selectedTimezone, canonicalInstantISO), dateFormat)
    : '';

  const formattedTimeDisplay = canonicalInstantISO
    ? format(TZDate.tz(selectedTimezone, canonicalInstantISO), timeFormat)
    : '';

  const [calendarOpener, setCalendarOpener] = useState<
    'button' | 'field' | null
  >(null);
  const calendarVisible = calendarOpener !== null;

  const [userDateInput, setUserDateInput] =
    useState<string>(formattedDateDisplay);
  const [userTimeInput, setUserTimeInput] =
    useState<string>(formattedTimeDisplay);

  useEffect(() => {
    setUserDateInput(formattedDateDisplay);
    setUserTimeInput(formattedTimeDisplay);
  }, [value, formattedDateDisplay, formattedTimeDisplay]);

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const skipOpenOnFocus = useRef(false);

  // The calendar that the field opens does not move the focus, so the
  // Popover does not give it back. When the focus is in the calendar (the
  // user went there with the down arrow), it goes back to the date text.
  const closeCalendar = useCallback(() => {
    const focusInCalendar = Boolean(
      calendarRef.current?.contains(document.activeElement),
    );

    setCalendarOpener(null);

    if (calendarOpener === 'field' && focusInCalendar) {
      skipOpenOnFocus.current = true;
      dateInputRef.current?.focus();
    }
  }, [calendarOpener]);

  // The calendar gets a day, then the time of the value stays the same in
  // the selected time zone.
  const handleChangeDay = (date: Date) => {
    const dateTimeInSelectedTz = canonicalInstantISO
      ? TZDate.tz(selectedTimezone, canonicalInstantISO)
      : tzStartOfDay(selectedTimezone);

    dateTimeInSelectedTz.setFullYear(date.getFullYear());
    dateTimeInSelectedTz.setMonth(date.getMonth(), date.getDate());

    commit(
      formatInstantInTimezone(
        dateTimeInSelectedTz,
        apiTimezone,
        serializationFormat,
      ),
    );

    closeCalendar();
  };

  const transformedDate = applyInputAsWallClock(
    canonicalInstantISO,
    (src, dest) => {
      dest.setFullYear(src.getFullYear());
      dest.setMonth(src.getMonth(), src.getDate());
    },
    {
      inputText: userDateInput,
      inputFormats: [dateFormat],
      inputTimezone: selectedTimezone,
    },
  );

  const serializedDateValue = transformedDate
    ? formatInstantInTimezone(transformedDate, apiTimezone, serializationFormat)
    : null;

  // The day of the calendar is the wall date in the selected time zone,
  // not in the time zone of the browser
  const selectedDay = transformedDate
    ? format(transformedDate, 'yyyy-MM-dd')
    : null;

  // A text that is not a date goes back to the value
  const handleDateTextBlur = () => {
    if (!serializedDateValue) {
      setUserDateInput(formattedDateDisplay);
      return;
    }

    commit(serializedDateValue);
  };

  const handleTimeTextBlur = () => {
    const transformedTime = applyInputAsWallClock(
      canonicalInstantISO,
      (src, dest) => {
        dest.setHours(src.getHours());
        dest.setMinutes(src.getMinutes());
        dest.setSeconds(seconds ? src.getSeconds() : 0);
      },
      {
        inputText: userTimeInput,
        inputFormats: timeFormats,
        inputTimezone: selectedTimezone,
      },
    );

    if (!transformedTime) {
      setUserTimeInput(formattedTimeDisplay);
      return;
    }

    commit(
      formatInstantInTimezone(
        transformedTime,
        apiTimezone,
        serializationFormat,
      ),
    );
  };

  const handleDateTextFocus = () => {
    if (skipOpenOnFocus.current) {
      skipOpenOnFocus.current = false;
      return;
    }

    if (!locked) {
      setCalendarOpener('field');
    }
  };

  // The down arrow moves the focus from the date text into the calendar
  const handleDateTextKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'ArrowDown' || !calendarVisible) {
      return;
    }

    const target = calendarRef.current?.querySelector<HTMLElement>(
      CALENDAR_FOCUS_TARGET,
    );

    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  const handleCalendarButtonClick = () => {
    setCalendarOpener(calendarVisible ? null : 'button');
  };

  // A new time zone keeps the instant of the value, and shows its wall clock
  // in the new time zone. Without a value, it applies to the date and the
  // time that the user types next.
  const handleTimezoneChange = (newTimezone: string | null) => {
    // The time zone menu cannot be cleared
    if (newTimezone === null) {
      return;
    }

    if (!canonicalInstantISO) {
      setSelectedTimezone(newTimezone);
      return;
    }

    const instantInOldTz = TZDate.tz(selectedTimezone, canonicalInstantISO);
    const instantInNewTz = new TZDate(instantInOldTz.getTime(), newTimezone);

    commit(
      formatInstantInTimezone(instantInNewTz, apiTimezone, serializationFormat),
    );

    setSelectedTimezone(newTimezone);
  };

  const [fieldElement, setFieldElement] = useState<HTMLDivElement | null>(null);

  // The calendar that the field opens closes when the focus goes out of the
  // field and out of the calendar (with Tab). The calendar that the button
  // opens takes the focus, so it does not close on a blur. The calendar is
  // in a portal, so its element is not in the element of the field, but
  // React gives its focus events to this handler.
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;

    if (
      calendarOpener === 'field' &&
      next &&
      !event.currentTarget.contains(next) &&
      !calendarRef.current?.contains(next)
    ) {
      setCalendarOpener(null);
    }
  };

  const formatTimezoneLabel = useCallback(
    (
      option: { label: string; value: string },
      { context }: { context: 'menu' | 'value' },
    ) =>
      context === 'value'
        ? shortTimezoneLabel(
            option.value,
            canonicalInstantISO ? new Date(canonicalInstantISO) : new Date(),
          )
        : option.label,
    [canonicalInstantISO],
  );

  // The time zone menu shows also without a value, so the field keeps its
  // width when the user sets a value
  const showTimezone =
    withTime && (timezoneSelect === 'always' || apiTimezone !== userTimezone);
  const showClear =
    Boolean(value) && !filter && clearable && Boolean(onChange) && !locked;

  return (
    <div
      onBlur={handleBlur}
      className={classNames('DateTimeInput', stateClass, {
        'DateTimeInput--smaller': filter,
        'DateTimeInput--with-time': withTime,
        'DateTimeInput--autosize': autosize || filter,
        'is-open': calendarVisible,
      })}
    >
      <div
        className={classNames('InputFrame DateTimeInput__field', stateClass, {
          'is-open': calendarVisible,
        })}
        ref={setFieldElement}
      >
        {!filter && (
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={UI.CalendarIcon}
            label={t('dateTimeInput.openCalendar')}
            className="InputFrame__control DateTimeInput__calendar-button"
            onClick={handleCalendarButtonClick}
            disabled={locked}
            aria-expanded={calendarVisible}
          />
        )}
        <AutosizeInput
          text={sizerText(dateFormat, userDateInput)}
          className="DateTimeInput__sizer DateTimeInput__sizer--date"
        >
          <input
            {...fieldProps}
            ref={dateInputRef}
            name={name}
            aria-label={ariaLabel ? tm(ariaLabel) : undefined}
            type="text"
            placeholder={dateFormat}
            value={userDateInput}
            onChange={(event) => setUserDateInput(event.target.value)}
            onFocus={handleDateTextFocus}
            onBlur={handleDateTextBlur}
            onKeyDown={handleDateTextKeyDown}
            className="InputFrame__input DateTimeInput__date"
            disabled={disabled}
            readOnly={showsReadOnly}
            spellCheck={false}
            autoComplete="off"
          />
        </AutosizeInput>
        <FieldWrapper.Boundary>
          {withTime && (
            <AutosizeInput
              text={sizerText(timeFormat, userTimeInput)}
              className="DateTimeInput__sizer DateTimeInput__sizer--time"
            >
              <input
                aria-label={t('dateTimeInput.time')}
                type="text"
                placeholder={timeFormat}
                value={userTimeInput}
                onChange={(event) => setUserTimeInput(event.target.value)}
                onBlur={handleTimeTextBlur}
                className="InputFrame__input DateTimeInput__time"
                disabled={disabled}
                readOnly={showsReadOnly}
                spellCheck={false}
                autoComplete="off"
              />
            </AutosizeInput>
          )}
          {showTimezone && (
            <SelectInput
              aria-label={t('dateTimeInput.timezone')}
              options={timezoneOptions}
              value={selectedTimezone}
              onChange={handleTimezoneChange}
              onBlur={handleTimezoneChange}
              className="DateTimeInput__timezone"
              classNamePrefix="DateTimeInput__timezone"
              formatOptionLabel={formatTimezoneLabel}
              autosize={true}
              variant="embedded"
              disabled={locked}
            />
          )}
        </FieldWrapper.Boundary>
        {showClear && (
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={Generic.CloseIcon}
            label={t('field.clearValue')}
            className="InputFrame__control DateTimeInput__clear"
            onClick={() => commit(null)}
          />
        )}
      </div>
      {calendarVisible && fieldElement && (
        <Popover
          anchorElement={fieldElement}
          placement={calendarPlacement}
          offset={4}
          onClose={closeCalendar}
          ariaLabel={{ id: 'dateTimeInput.calendar' }}
          autoFocus={
            calendarOpener === 'button' ? CALENDAR_FOCUS_TARGET : undefined
          }
        >
          <div ref={calendarRef} className="DateTimeInput__date-popper">
            <CalendarGrid
              selection={{ start: selectedDay, end: selectedDay }}
              onChange={handleChangeDay}
              selectableDays={selectableDays}
            />
          </div>
        </Popover>
      )}
    </div>
  );
}
