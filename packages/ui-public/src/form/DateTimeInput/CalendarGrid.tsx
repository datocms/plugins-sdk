import classNames from 'classnames';
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigation, UI } from '../../../icons/index';
import Button from '../../actions/Button';
import { useDateSettings } from '../../content/DateSettings';
import { useAutoincrementIntegerId } from '../../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../../i18n';
import RawButton from '../../semantic/RawButton';
import { weekStartForLocale } from '../../utils/weekStartForLocale';
import { intlDateTimeFormat } from './dateText';

type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function generateMatrix(month: Date, weekStartsOn: WeekStart): Date[][] {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const start = startOfWeek(firstDay, { weekStartsOn });
  const rows =
    differenceInCalendarWeeks(lastDay, firstDay, { weekStartsOn }) + 1;

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => addDays(start, row * 7 + col)),
  );
}

// The names come from Intl and not from a locale of date-fns, because a
// plugin then does not load the data of all the languages.
function useCalendarNames(locale: string) {
  return useMemo(
    () => ({
      month: intlDateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      weekdayShort: intlDateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: intlDateTimeFormat(locale, { weekday: 'long' }),
      day: intlDateTimeFormat(locale, { dateStyle: 'full' }),
    }),
    [locale],
  );
}

/** The day that a key moves the focus to, or null for another key */
function dayForKey(
  event: React.KeyboardEvent,
  day: Date,
  weekStartsOn: WeekStart,
): Date | null {
  switch (event.key) {
    case 'ArrowLeft':
      return addDays(day, -1);
    case 'ArrowRight':
      return addDays(day, 1);
    case 'ArrowUp':
      return addDays(day, -7);
    case 'ArrowDown':
      return addDays(day, 7);
    case 'Home':
      return startOfWeek(day, { weekStartsOn });
    case 'End':
      return startOfDay(endOfWeek(day, { weekStartsOn }));
    case 'PageUp':
      return event.shiftKey ? addYears(day, -1) : addMonths(day, -1);
    case 'PageDown':
      return event.shiftKey ? addYears(day, 1) : addMonths(day, 1);
    default:
      return null;
  }
}

/** The selector of the day that has the focus, or that gets it with Tab */
export const CALENDAR_FOCUS_TARGET =
  '.DateTimeInput__CalendarDayCell[tabindex="0"]';

/**
 * The selected days, as 'yyyy-MM-dd'. One date has the same day in `start`
 * and `end`. A range that has only one end has null in the other.
 */
export type CalendarSelection = {
  start: string | null;
  end: string | null;
};

/**
 * The days that the user can pick in the calendar. "future" is today and the
 * days after it. "past" is today and the days before it.
 */
export type SelectableDays = 'all' | 'future' | 'past';

type CalendarGridProps = {
  selection: CalendarSelection;
  selectableDays: SelectableDays;
  onChange: (day: Date) => void;
};

/**
 * Moves the focused day to an end of the selection when the end changes
 * from outside the grid: the user types a date in the text. A pick in the
 * grid does not move it, because the focus stays on the picked day. The
 * effect runs after each render, so a pick that does not change the
 * selection clears its flag on the next render.
 */
function useFollowSelection(
  selection: CalendarSelection,
  setFocusedDay: (day: Date) => void,
) {
  const previous = useRef(selection);
  const pickedInGrid = useRef(false);

  useEffect(() => {
    const { start, end } = previous.current;
    const picked = pickedInGrid.current;
    previous.current = selection;
    pickedInGrid.current = false;

    const moved =
      selection.end !== end
        ? selection.end
        : selection.start !== start
          ? selection.start
          : null;

    if (moved && !picked) {
      setFocusedDay(parseISO(moved));
    }
  });

  return pickedInGrid;
}

/**
 * The days of a month in a grid, for one date or for a range. The arrows,
 * Home, End, Page Up and Page Down move the focus between the days, as in
 * the date picker of the WAI-ARIA Authoring Practices. Only one day is in
 * the Tab order.
 */
export default function CalendarGrid({
  selection,
  selectableDays,
  onChange,
}: CalendarGridProps) {
  const { t } = useTranslation();
  const { locale } = useDateSettings();
  const names = useCalendarNames(locale);
  const weekStartsOn = weekStartForLocale(locale);
  const titleId = `DateTimeInput-calendar-${useAutoincrementIntegerId()}`;

  const startDate = selection.start ? parseISO(selection.start) : null;
  const endDate = selection.end ? parseISO(selection.end) : null;

  // The month on screen is always the month of the focused day
  const [focusedDay, setFocusedDay] = useState<Date>(() =>
    startOfDay(startDate ?? endDate ?? new Date()),
  );

  const pickedInGrid = useFollowSelection(selection, setFocusedDay);

  const month = startOfMonth(focusedDay);
  const monthKey = month.getTime();

  const matrix = useMemo(
    () => generateMatrix(month, weekStartsOn),
    [monthKey, weekStartsOn],
  );

  const gridRef = useRef<HTMLDivElement | null>(null);
  const focusAfterRender = useRef(false);

  useEffect(() => {
    if (!focusAfterRender.current) {
      return;
    }

    focusAfterRender.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>(CALENDAR_FOCUS_TARGET)
      ?.focus({ preventScroll: true });
  }, [focusedDay]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const next = dayForKey(event, focusedDay, weekStartsOn);

    if (!next) {
      return;
    }

    event.preventDefault();
    focusAfterRender.current = true;
    setFocusedDay(next);
  };

  const handlePick = (day: Date) => {
    pickedInGrid.current = true;
    onChange(day);
  };

  const today = startOfDay(new Date());

  return (
    <div>
      <div className="DateTimeInput__CalendarHeader">
        <div
          className="DateTimeInput__CalendarHeader__title"
          id={titleId}
          aria-live="polite"
        >
          {names.month.format(month)}
        </div>
        <div className="DateTimeInput__CalendarHeader__actions">
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={Navigation.ChevronLeftIcon}
            label={t('dateTimeInput.previousMonth')}
            className="DateTimeInput__CalendarHeader__action--prev"
            onClick={() => setFocusedDay((day) => addMonths(day, -1))}
          />
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={UI.CircleDotIcon}
            label={t('dateTimeInput.currentMonth')}
            className="DateTimeInput__CalendarHeader__action--today"
            onClick={() => setFocusedDay(startOfDay(new Date()))}
          />
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={Navigation.ChevronRightIcon}
            label={t('dateTimeInput.nextMonth')}
            className="DateTimeInput__CalendarHeader__action--next"
            onClick={() => setFocusedDay((day) => addMonths(day, 1))}
          />
        </div>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={titleId}
        className="DateTimeInput__CalendarGrid"
        style={{ gridTemplateRows: `auto repeat(${matrix.length}, 1fr)` }}
        onKeyDown={handleKeyDown}
      >
        {/* biome-ignore lint/a11y/useFocusableInteractive: the day buttons take the focus, with a roving tabindex */}
        <div role="row" className="DateTimeInput__CalendarRow">
          {matrix[0].map((day) => (
            // biome-ignore lint/a11y/useFocusableInteractive: a column header is not interactive in a date grid
            <div
              role="columnheader"
              className="DateTimeInput__CalendarWeekDay"
              key={day.getTime()}
              aria-label={names.weekdayLong.format(day)}
            >
              {names.weekdayShort.format(day)}
            </div>
          ))}
        </div>
        {matrix.map((week) => (
          // biome-ignore lint/a11y/useFocusableInteractive: the day buttons take the focus, with a roving tabindex
          <div
            role="row"
            className="DateTimeInput__CalendarRow"
            key={week[0].getTime()}
          >
            {week.map((day) => {
              const isEdge = Boolean(
                (startDate && isSameDay(day, startDate)) ||
                  (endDate && isSameDay(day, endDate)),
              );
              const isBetween = Boolean(
                startDate &&
                  endDate &&
                  isAfter(day, startDate) &&
                  isBefore(day, endDate),
              );
              const isDisabled =
                selectableDays === 'future'
                  ? isBefore(day, today)
                  : selectableDays === 'past'
                    ? isAfter(day, today)
                    : false;

              return (
                // biome-ignore lint/a11y/useFocusableInteractive: the day button in the cell takes the focus
                <div
                  role="gridcell"
                  className="DateTimeInput__CalendarCell"
                  aria-selected={isEdge || isBetween}
                  key={day.getTime()}
                >
                  <RawButton
                    className={classNames('DateTimeInput__CalendarDayCell', {
                      'DateTimeInput__CalendarDayCell--isToday': isToday(day),
                      'DateTimeInput__CalendarDayCell--isSelected': isEdge,
                      'DateTimeInput__CalendarDayCell--inRange': isBetween,
                      'DateTimeInput__CalendarDayCell--inAdjacentMonth':
                        !isSameMonth(day, month),
                    })}
                    ariaLabel={names.day.format(day)}
                    aria-current={isToday(day) ? 'date' : undefined}
                    tabIndex={isSameDay(day, focusedDay) ? 0 : -1}
                    disabled={isDisabled ? 'focusable' : false}
                    // A click on a day of the next or of the previous month
                    // does not change the month: the click selects the day.
                    onFocus={() => {
                      if (isSameMonth(day, month)) {
                        setFocusedDay(day);
                      }
                    }}
                    onClick={() => handlePick(day)}
                  >
                    {format(day, 'd')}
                  </RawButton>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
