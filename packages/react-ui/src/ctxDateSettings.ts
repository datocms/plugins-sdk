import type { DateSettings } from 'ui/DateSettings';
import type { BaseCtx } from './ctx';

/**
 * The date settings that `ctx.ui` has from the release of the SDK that adds
 * them. A host that is older than that release gives only `locale`.
 */
type CtxUi = BaseCtx['ui'] & Partial<Omit<DateSettings, 'locale'>>;

// The same choices as the first settings that the cms gives to a new user,
// from the language of the user.
function defaultDateFormat(locale: string) {
  switch (locale) {
    case 'en':
      return 'MM/dd/yyyy';
    case 'cs':
      return 'd. MM. yyyy';
    case 'ru':
      return 'dd.MM.yyyy';
    default:
      return 'dd/MM/yyyy';
  }
}

/**
 * The date settings of the user from `ctx.ui`. A field that the host does
 * not give gets the first value of the cms for the language of the user,
 * and the time zone of the browser.
 */
export function ctxDateSettings(ui: CtxUi): DateSettings {
  return {
    locale: ui.locale,
    dateFormat: ui.dateFormat ?? defaultDateFormat(ui.locale),
    timezone: ui.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    twentyFourHour: ui.twentyFourHour ?? ui.locale === 'en',
  };
}
