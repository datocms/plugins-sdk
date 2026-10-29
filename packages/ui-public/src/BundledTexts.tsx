import { IntlMessageFormat, type PrimitiveType } from 'intl-messageformat';
import React, { ReactNode, useMemo } from 'react';
import en from '../locales/en.json';
import {
  type TextsAdapter,
  TextsProvider,
  type TextValues,
} from './TextsProvider';
import type { UiTextKey } from './UiTextKey';

export type { UiTextKey };

const bundledTexts: Record<string, string> = en;

const warnedKeys = new Set<string>();

function warnOnMissingText(key: string) {
  if (!import.meta.env.DEV || warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(
    `BundledTexts has no text for the key "${key}": the key shows as it is. Give its text in the texts prop.`,
  );
}

export type BundledTextsProps = {
  /**
   * More texts, by key. A key of ui-public gets a new text, and a key that ui-public does
   * not have (a key of the host) gets its text. A text uses the ICU syntax.
   * The keys of ui-public autocomplete; a key of the host is any string. Give a
   * stable object (a constant or `useMemo`): a new object makes a new
   * adapter, and all the texts render again.
   */
  texts?: Partial<Record<UiTextKey, string>> & Record<string, string>;
  /**
   * The language of the plurals, of the numbers and of the dates in the
   * texts
   * @default 'en'
   */
  locale?: string;
  /** The app */
  children: ReactNode;
};

/**
 * Gives the English texts of ui-public, and the `texts` of the host, to the
 * components of ui-public, without i18next. Put it once, near the root.
 */
export default function BundledTexts({
  texts,
  locale = 'en',
  children,
}: BundledTextsProps) {
  const value = useMemo<TextsAdapter>(() => {
    const formats = new Map<string, IntlMessageFormat>();

    function format(text: string, values?: TextValues) {
      let message = formats.get(text);

      if (!message) {
        // The texts of ui-public have HTML tags, which `tc` renders. Thus the
        // parser keeps a tag as text, as `i18next-icu` does. A plural or a
        // select without an `other` clause gives no error, as in the apps
        // (`packages/ui-apps/patches/`). A plugin gets the parser from npm
        // without the patch, thus the option is explicit.
        message = new IntlMessageFormat(text, locale, undefined, {
          ignoreTag: true,
          requiresOtherClause: false,
        });
        formats.set(text, message);
      }

      // A value that is not a primitive makes `format` give an array of parts
      const result = message.format<unknown>(
        values as Record<string, PrimitiveType>,
      );
      if (typeof result === 'string') {
        return result;
      }
      return Array.isArray(result) ? result.join('') : String(result);
    }

    return {
      t: (key, values) => {
        const defaultValue =
          typeof values?.defaultValue === 'string'
            ? values.defaultValue
            : undefined;
        const text = texts?.[key] ?? bundledTexts[key] ?? defaultValue;
        if (text === undefined) {
          warnOnMissingText(key);
          return key;
        }

        // A text with an error, or a value that is not given, shows the text
        // as it is. It does not stop the render.
        try {
          return format(text, values);
        } catch {
          return text;
        }
      },
      locale,
    };
  }, [texts, locale]);

  return <TextsProvider value={value}>{children}</TextsProvider>;
}
