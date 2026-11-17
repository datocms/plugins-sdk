import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

/** The date-fns pattern of the value of `DateInput` */
export const DATE_VALUE_FORMAT = 'yyyy-MM-dd';

/**
 * The date-fns pattern of the value of `DateTimeInput` and of the ends of
 * `DateTimeRangeInput`: an ISO 8601 date and time with an offset, as the API
 * gives it
 */
export const DATE_TIME_VALUE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX";

/**
 * Formats an instant (a Date or epoch milliseconds) as the wall clock of
 * the target time zone.
 *
 * Example: an instant, "Europe/London" and DATE_TIME_VALUE_FORMAT give the
 * ISO string of that instant with the offset of London.
 */
export function formatInstantInTimezone(
  instant: Date | number,
  targetTimezone: string,
  formatString: string,
): string {
  const epochMillis = typeof instant === 'number' ? instant : instant.getTime();
  return format(new TZDate(epochMillis, targetTimezone), formatString);
}

/**
 * The value of an instant for `DateTimeInput` and `DateTimeRangeInput`:
 * the ISO string with the offset of the time zone
 */
export function formatDateTimeValue(
  instant: Date | number,
  timezone: string,
): string {
  return formatInstantInTimezone(instant, timezone, DATE_TIME_VALUE_FORMAT);
}
