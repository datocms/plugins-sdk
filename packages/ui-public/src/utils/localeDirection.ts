import rtlDetect from 'rtl-detect';

const cache: Record<string, 'rtl' | 'ltr'> = {};

/** The direction of the text of a language: "rtl" for Arabic or Hebrew, "ltr" for the others. */
const localeDirection = (locale: string): 'rtl' | 'ltr' => {
  if (cache[locale]) {
    return cache[locale];
  }
  cache[locale] = rtlDetect.isRtlLang(locale) ? 'rtl' : 'ltr';
  return cache[locale];
};

export default localeDirection;
