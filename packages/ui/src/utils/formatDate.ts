import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

/**
 * The settings of the user that the format of a date needs. The app gives
 * them (the cms takes them from the store).
 */
export type DateSettings = {
  /**
   * A BCP 47 language tag, for example 'it'. formatRelativeTime uses it for
   * the words of a relative time ("3 giorni fa"). SmartDate does not use it.
   */
  locale: string;
  /**
   * A date-fns pattern, for example 'dd/MM/yyyy'. The names of the months
   * and of the days ('MMM', 'EEE') are always in English.
   */
  dateFormat: string;
  /** An IANA time zone, for example 'Europe/Rome' */
  timezone: string;
  twentyFourHour: boolean;
};

const PLAIN_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Two kinds of values flow through these helpers, and they want different
 * treatment:
 *
 * - A **plain date** (`'YYYY-MM-DD'` string from a date-only field) carries
 *   no time and no timezone. It's the same value everywhere — splitting it
 *   into Y/M/D and reformatting is the only correct rendering. Routing it
 *   through `TZDate` is what creates off-by-one bugs: JS parses date-only
 *   ISO strings as UTC midnight, so any zone west of UTC renders the day
 *   before.
 *
 * - An **instant** (`Date`, or a full ISO datetime string) is a specific
 *   moment in time. To turn it into wall-clock text it must be projected
 *   into a timezone — by convention, the user's UI timezone.
 *
 * `formatDate` accepts both: plain-date strings render literally, `Date`
 * instants render their date portion in the user's UI timezone. The other
 * helpers (`formatTime`, `formatDateTime`, `isToday`) only deal with
 * instants and always use the user's UI timezone.
 */

export function formatDate(
  value: string | Date,
  localizationSettings: DateSettings,
): string {
  if (typeof value === 'string' && PLAIN_DATE_RE.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return format(
      new Date(year, month - 1, day),
      localizationSettings.dateFormat,
    );
  }

  const instant =
    typeof value === 'string'
      ? new TZDate(value, localizationSettings.timezone)
      : new TZDate(value.getTime(), localizationSettings.timezone);

  return format(instant, localizationSettings.dateFormat);
}

/**
 * The value for the "datetime" attribute of a <time> element: a plain date
 * stays as it is, and an instant becomes an ISO 8601 string in UTC.
 */
export function toDateTimeAttribute(value: string | Date): string | undefined {
  if (typeof value === 'string' && PLAIN_DATE_RE.test(value)) {
    return value;
  }

  const date = typeof value === 'string' ? new Date(value) : value;

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function formatTime(
  value: string | Date,
  localizationSettings: DateSettings,
  withSeconds = false,
): string {
  const instant =
    typeof value === 'string'
      ? new TZDate(value, localizationSettings.timezone)
      : new TZDate(value.getTime(), localizationSettings.timezone);

  const pattern = localizationSettings.twentyFourHour
    ? withSeconds
      ? 'HH:mm:ss'
      : 'HH:mm'
    : withSeconds
      ? 'hh:mm:ss aa'
      : 'hh:mm aa';

  return format(instant, pattern);
}

export function isToday(
  value: string | Date,
  localizationSettings: DateSettings,
) {
  const instant =
    typeof value === 'string'
      ? new TZDate(value, localizationSettings.timezone)
      : new TZDate(value.getTime(), localizationSettings.timezone);

  return format(instant, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy');
}

export function formatDateTime(
  value: string | Date,
  localizationSettings: DateSettings,
  todayLabel: string | false,
  withSeconds = false,
): string {
  const instant =
    typeof value === 'string'
      ? new TZDate(value, localizationSettings.timezone)
      : new TZDate(value.getTime(), localizationSettings.timezone);

  const formattedDate = format(instant, localizationSettings.dateFormat);
  const formattedTime = formatTime(instant, localizationSettings, withSeconds);

  if (todayLabel && isToday(instant, localizationSettings)) {
    return `${todayLabel}, ${formattedTime}`;
  }

  return `${formattedDate}, ${formattedTime}`;
}

/**
 * A precise, unambiguous full timestamp in the user's UI timezone: date, time
 * **with seconds**, and the timezone offset (`+02:00`) — or `Z` for UTC. Use
 * this where the exact instant matters (e.g. an audit-log detail); use
 * `formatDateTime` (no seconds/offset) for the relative "Today, 16:49" feel of
 * log lists. The `XXX` offset token matches `DateTimeInput`'s convention.
 */
export function formatFullDateTime(
  value: string | Date,
  localizationSettings: DateSettings,
): string {
  const instant =
    typeof value === 'string'
      ? new TZDate(value, localizationSettings.timezone)
      : new TZDate(value.getTime(), localizationSettings.timezone);

  const time = localizationSettings.twentyFourHour ? 'HH:mm:ss' : 'hh:mm:ss aa';
  return format(instant, `${localizationSettings.dateFormat}, ${time} XXX`);
}

export function formatMaybeDateTime(
  value: any,
  localizationSettings: DateSettings,
) {
  if (
    typeof value === 'string' &&
    value.match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}/)
  ) {
    return formatDateTime(value, localizationSettings, false);
  }

  if (typeof value === 'string' && PLAIN_DATE_RE.test(value)) {
    return formatDate(value, localizationSettings);
  }

  return value;
}

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
];

/**
 * The text always has a number ("1 day ago", not "yesterday"), thus it can go
 * after a word, as in "Updated 1 day ago", in all the languages.
 */
export function formatRelativeTime(
  value: string | Date,
  localizationSettings: DateSettings,
): string {
  const time = typeof value === 'string' ? Date.parse(value) : value.getTime();
  const seconds = Math.round((time - Date.now()) / 1000);
  const [unit, size] = RELATIVE_TIME_UNITS.find(
    ([, unitSize]) => Math.abs(seconds) >= unitSize,
  ) ?? ['second', 1];

  return new Intl.RelativeTimeFormat(localizationSettings.locale, {
    numeric: 'always',
  }).format(Math.round(seconds / size), unit);
}
