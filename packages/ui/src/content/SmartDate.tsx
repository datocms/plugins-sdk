import React from 'react';
import { useTranslation } from '../i18n';
import {
  formatDate,
  formatDateTime,
  formatTime,
  toDateTimeAttribute,
} from '../utils/formatDate';
import { useDateSettings } from './DateSettings';

export type SmartDateProps = {
  /**
   * The date: a `Date`, or an ISO 8601 string as the API gives it, for
   * example "2026-10-15T09:30:00Z". With no value, SmartDate renders
   * nothing.
   */
  value: Date | string | null | undefined;
  /**
   * What shows: "date" is only the date, with the format of the user (for
   * example "15/10/2026"), "time" is only the time (for example "09:30"),
   * and "dateTime" is both.
   * @default "dateTime"
   */
  show?: 'date' | 'time' | 'dateTime';
  /**
   * Add the seconds to the time. It has no effect with `show="date"`.
   * @default false
   */
  withSeconds?: boolean;
  /**
   * Show "Today, 09:30" in place of the date and the time when the date is
   * today. It has an effect only with `show="dateTime"`.
   * @default true
   */
  todayShortcut?: boolean;
};

/**
 * A date or a time in the format of the user: the date format, the time zone
 * and the 12 or 24 hour clock come from the nearest DateSettingsProvider,
 * which must be above it. It renders an inline <time> element with the exact
 * value in "datetime", or nothing when there is no value.
 */
export default function SmartDate({
  value,
  show = 'dateTime',
  withSeconds = false,
  todayShortcut = true,
}: SmartDateProps) {
  const { t } = useTranslation();
  const dateSettings = useDateSettings();

  if (!value) {
    return null;
  }

  const text =
    show === 'date'
      ? formatDate(value, dateSettings)
      : show === 'time'
        ? formatTime(value, dateSettings, withSeconds)
        : formatDateTime(
            value,
            dateSettings,
            todayShortcut && t('date.today'),
            withSeconds,
          );

  return <time dateTime={toDateTimeAttribute(value)}>{text}</time>;
}
