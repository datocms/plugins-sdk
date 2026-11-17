import { isValid, parse } from 'date-fns';
import { isDefined } from '../../utils/isDefined';

/**
 * The date-fns patterns that the time text accepts, in order. The first one
 * is the pattern of the text that the input shows.
 */
export function timeInputFormats(
  twentyFourHour: boolean,
  seconds: boolean,
): string[] {
  return twentyFourHour
    ? [seconds && 'HH:mm:ss', 'HH:mm', 'HH'].filter(isDefined)
    : [
        seconds && 'hh:mm:ss aa',
        seconds && 'HH:mm:ss',
        'hh:mm aa',
        'HH:mm',
        'hh aa',
        'HH',
      ].filter(isDefined);
}

/** Parses the text of the user with the first pattern that matches */
export function parseDateText(text: string, formats: string[]): Date | null {
  for (const pattern of formats) {
    const parsed = parse(text, pattern, new Date());

    if (isValid(parsed)) {
      return parsed;
    }
  }

  return null;
}

// An invalid language tag makes Intl throw. The names then are in English.
export function intlDateTimeFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  try {
    return new Intl.DateTimeFormat(locale, options);
  } catch {
    return new Intl.DateTimeFormat('en', options);
  }
}
