import { TZDate } from '@date-fns/tz';
import { intlDateTimeFormat } from '../DateTimeInput/dateText';

type FormatRange = (start: Date, end: Date) => string;

// The lib of the package is ES2020, which has no type for formatRange. All
// the browsers and Node have it since 2021.
function formatRange(format: Intl.DateTimeFormat, start: Date, end: Date) {
  return (format as unknown as { formatRange: FormatRange }).formatRange(
    start,
    end,
  );
}

type RangeLabelOptions = {
  locale: string;
  timezone: string;
  twentyFourHour: boolean;
};

/**
 * The texts of the ends of a custom range for the trigger. A range in one
 * day shows the times, and a range out of the current year shows the year.
 * Intl puts the parts in the order of the language ("Nov 3 – 5", "3–5 nov").
 */
export function formatRangeEnds(
  start: Date | null,
  end: Date | null,
  { locale, timezone, twentyFourHour }: RangeLabelOptions,
): { kind: 'both'; text: string } | { kind: 'start' | 'end'; text: string } {
  const dayOf = (date: Date) => {
    const local = new TZDate(date.getTime(), timezone);
    return {
      year: local.getFullYear(),
      key: `${local.getFullYear()}-${local.getMonth()}-${local.getDate()}`,
    };
  };

  const ends = [start, end].filter((date): date is Date => date !== null);
  const currentYear = dayOf(new Date()).year;
  const showsYear = ends.some((date) => dayOf(date).year !== currentYear);
  const oneDay = Boolean(start && end && dayOf(start).key === dayOf(end).key);

  const format = intlDateTimeFormat(locale, {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    year: showsYear ? 'numeric' : undefined,
    hour: oneDay ? 'numeric' : undefined,
    minute: oneDay ? '2-digit' : undefined,
    hourCycle: oneDay ? (twentyFourHour ? 'h23' : 'h12') : undefined,
  });

  if (start && end) {
    return { kind: 'both', text: formatRange(format, start, end) };
  }

  return start
    ? { kind: 'start', text: format.format(start) }
    : { kind: 'end', text: format.format(end as Date) };
}
