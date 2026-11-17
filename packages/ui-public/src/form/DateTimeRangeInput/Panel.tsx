import { TZDate } from '@date-fns/tz';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Button from '../../actions/Button';
import { useDateSettings } from '../../content/DateSettings';
import { useAutoincrementIntegerId } from '../../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../../i18n';
import { timezoneOptions } from '../../utils/timezones';
import CalendarGrid, {
  type SelectableDays,
} from '../DateTimeInput/CalendarGrid';
import { parseDateText, timeInputFormats } from '../DateTimeInput/dateText';
import { formatDateTimeValue } from '../DateTimeInput/value';
import SelectInput from '../SelectInput';

/** A custom range: the ISO strings of its two ends */
export type RangeEnds = { start: string | null; end: string | null };

type Edge = keyof RangeEnds;

/** An end that the user picks as a day gets this time */
const DAY_EDGE_TIME: Record<Edge, [number, number]> = {
  start: [0, 0],
  end: [23, 59],
};

/** The instant of a wall clock: the day and the time in the time zone */
function atTime(day: Date, [hours, minutes]: [number, number], tz: string) {
  const wallClock = new TZDate(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hours,
    minutes,
    0,
    tz,
  );
  return new Date(wallClock.getTime());
}

type EdgeInputsProps = {
  edge: Edge;
  value: string | null;
  timezone: string;
  /** The time zone of the offset of the value */
  valueTimezone: string;
  /** The next pick in the calendar sets this end */
  active: boolean;
  onActivate: () => void;
  onChange: (value: string) => void;
};

/**
 * The date text and the time text of one end. A text is read when the user
 * leaves it, and a text that is not a date or a time goes back to the value.
 */
function EdgeInputs({
  edge,
  value,
  timezone,
  valueTimezone,
  active,
  onActivate,
  onChange,
}: EdgeInputsProps) {
  const { t } = useTranslation();
  const { dateFormat, twentyFourHour } = useDateSettings();
  const timeFormats = timeInputFormats(twentyFourHour, false);
  const dateInputId = `DateTimeRangeInput-${edge}-${useAutoincrementIntegerId()}`;

  const local = value ? new TZDate(value, timezone) : null;
  const dateText = local ? format(local, dateFormat) : '';
  const timeText = local ? format(local, timeFormats[0]) : '';

  const [dateInput, setDateInput] = useState(dateText);
  const [timeInput, setTimeInput] = useState(timeText);

  useEffect(() => setDateInput(dateText), [dateText]);
  useEffect(() => setTimeInput(timeText), [timeText]);

  const handleDateBlur = () => {
    const day = parseDateText(dateInput, [dateFormat]);

    if (!day) {
      setDateInput(dateText);
      return;
    }

    const time: [number, number] = local
      ? [local.getHours(), local.getMinutes()]
      : DAY_EDGE_TIME[edge];

    onChange(formatDateTimeValue(atTime(day, time, timezone), valueTimezone));
  };

  const handleTimeBlur = () => {
    const time = parseDateText(timeInput, timeFormats);

    if (!time || !local) {
      setTimeInput(timeText);
      return;
    }

    onChange(
      formatDateTimeValue(
        atTime(local, [time.getHours(), time.getMinutes()], timezone),
        valueTimezone,
      ),
    );
  };

  return (
    <div className="DateTimeRangeInput__edge">
      <label htmlFor={dateInputId} className="DateTimeRangeInput__edge-label">
        {t(
          edge === 'start'
            ? 'dateTimeRangeInput.start'
            : 'dateTimeRangeInput.end',
        )}
      </label>
      <div className="DateTimeRangeInput__edge-inputs">
        <input
          id={dateInputId}
          type="text"
          className={classNames('DateTimeRangeInput__edge-date', {
            'is-active': active,
          })}
          placeholder={dateFormat}
          value={dateInput}
          onChange={(event) => setDateInput(event.target.value)}
          onFocus={onActivate}
          onBlur={handleDateBlur}
          spellCheck={false}
          autoComplete="off"
        />
        <input
          type="text"
          aria-label={t(
            edge === 'start'
              ? 'dateTimeRangeInput.startTime'
              : 'dateTimeRangeInput.endTime',
          )}
          className="DateTimeRangeInput__edge-time"
          placeholder={timeFormats[0]}
          value={timeInput}
          onChange={(event) => setTimeInput(event.target.value)}
          onBlur={handleTimeBlur}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

type PanelProps = {
  /** The range when the panel opens */
  initial: RangeEnds;
  timezone: string;
  /** The time zone of the offset of the value */
  valueTimezone: string;
  /** Shows the time zone menu */
  showsTimezone: boolean;
  onTimezoneChange: (timezone: string) => void;
  selectableDays: SelectableDays;
  onApply: (range: RangeEnds) => void;
};

/**
 * The custom range: a calendar, the texts of the two ends, the time zone and
 * the Apply button. The range changes only on Apply.
 */
export default function Panel({
  initial,
  timezone,
  valueTimezone,
  showsTimezone,
  onTimezoneChange,
  selectableDays,
  onApply,
}: PanelProps) {
  const { t } = useTranslation();
  const [range, setRange] = useState<RangeEnds>(initial);
  const [activeEdge, setActiveEdge] = useState<Edge>('start');
  const toValue = (instant: Date) =>
    formatDateTimeValue(instant, valueTimezone);

  const dayOf = (value: string | null) =>
    value ? format(new TZDate(value, timezone), 'yyyy-MM-dd') : null;

  // The first pick sets the start, the second sets the end. An end before
  // the start becomes the start, and the old start becomes the end.
  const handlePickDay = (day: Date) => {
    if (activeEdge === 'start') {
      setRange((current) => ({
        ...current,
        start: toValue(atTime(day, DAY_EDGE_TIME.start, timezone)),
      }));
      setActiveEdge('end');
      return;
    }

    const end = atTime(day, DAY_EDGE_TIME.end, timezone);
    const start = range.start ? new TZDate(range.start, timezone) : null;

    if (start && end.getTime() < start.getTime()) {
      setRange({
        start: toValue(atTime(day, DAY_EDGE_TIME.start, timezone)),
        end: toValue(atTime(start, DAY_EDGE_TIME.end, timezone)),
      });
    } else {
      setRange((current) => ({ ...current, end: toValue(end) }));
    }

    setActiveEdge('start');
  };

  return (
    <div className="DateTimeRangeInput__panel">
      <CalendarGrid
        selection={{ start: dayOf(range.start), end: dayOf(range.end) }}
        selectableDays={selectableDays}
        onChange={handlePickDay}
      />
      <div className="DateTimeRangeInput__edges">
        {(['start', 'end'] as const).map((edge) => (
          <EdgeInputs
            key={edge}
            edge={edge}
            value={range[edge]}
            timezone={timezone}
            valueTimezone={valueTimezone}
            active={activeEdge === edge}
            onActivate={() => setActiveEdge(edge)}
            onChange={(value) =>
              setRange((current) => ({ ...current, [edge]: value }))
            }
          />
        ))}
        <Button
          tone="primary"
          size="small"
          expand
          label={t('dateTimeRangeInput.apply')}
          className="DateTimeRangeInput__apply"
          onClick={() => onApply(range)}
        />
        {showsTimezone && (
          <SelectInput
            aria-label={t('dateTimeInput.timezone')}
            className="DateTimeRangeInput__timezone"
            options={timezoneOptions}
            value={timezone}
            onChange={(value) => value && onTimezoneChange(value)}
          />
        )}
      </div>
    </div>
  );
}
