import React, { createContext, ReactNode, useContext } from 'react';
import { DateSettings } from '../utils/formatDate';

export type { DateSettings };

const DateSettingsContext = createContext<DateSettings | null>(null);

export type DateSettingsProviderProps = {
  /** The date settings of the user. Give a stable object (`useMemo`). */
  value: DateSettings;
  /** The app */
  children: ReactNode;
};

/**
 * Gives the date settings of the user to all the SmartDate and TimeCell
 * below it, and to useDateSettings. The app mounts it once, near the root,
 * through UiProvider.
 */
export function DateSettingsProvider({
  value,
  children,
}: DateSettingsProviderProps) {
  return (
    <DateSettingsContext.Provider value={value}>
      {children}
    </DateSettingsContext.Provider>
  );
}

/**
 * The date settings of the user, from the nearest DateSettingsProvider. Give
 * them to the helpers of ui-public/utils/formatDate.
 */
export function useDateSettings(): DateSettings {
  const settings = useContext(DateSettingsContext);

  // A date in the wrong time zone or format is an error that is easy to
  // miss. Thus a missing provider stops the render with a clear message.
  if (!settings) {
    throw new Error(
      'A component of ui-public has no DateSettingsProvider above it. Give the date settings of the user to UiProvider, or put a DateSettingsProvider near the root.',
    );
  }

  return settings;
}
