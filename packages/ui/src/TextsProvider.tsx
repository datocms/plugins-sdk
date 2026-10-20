import React, { createContext, ReactNode, useContext } from 'react';

/** The values of a text: each `{name}` of the text gets the value `name` */
export type TextValues = Record<string, unknown>;

/**
 * What the components of ui need to show a text: the engine of the texts of
 * the host. `I18nextTexts` and `BundledTexts` make one.
 */
export type TextsAdapter = {
  /**
   * Gives the text of a key, with its values in the ICU syntax. A key
   * without a text gives `values.defaultValue` when it is a string, else the
   * key. It never throws. Keep the HTML tags of a text as text: `tc` and
   * `FormattedHTMLMessage` render them.
   */
  t: (key: string, values?: TextValues) => string;
  /** The language of the texts, for example "en" */
  locale: string;
};

const TextsContext = createContext<TextsAdapter | null>(null);

export type TextsProviderProps = {
  /** The engine of the texts of the host. Give a stable object (`useMemo`). */
  value: TextsAdapter;
  /** The app */
  children: ReactNode;
};

/**
 * Gives the engine of the texts of the host to the components of ui. Put it
 * once, near the root of the app.
 */
export function TextsProvider({ value, children }: TextsProviderProps) {
  return (
    <TextsContext.Provider value={value}>{children}</TextsContext.Provider>
  );
}

/** The engine of the texts of the host, from the nearest TextsProvider */
export function useTexts(): TextsAdapter {
  const adapter = useContext(TextsContext);

  // A text that shows its key is an error that is easy to miss. Thus a
  // missing provider stops the render with a clear message.
  if (!adapter) {
    throw new Error(
      'A component of ui has no TextsProvider above it. Put I18nextTexts (an app with i18next) or BundledTexts (the English texts of ui) near the root.',
    );
  }

  return adapter;
}

export default TextsProvider;
