import React from 'react';
import DateTimeInputBase, {
  type DateInputCommonProps,
} from './DateTimeInput/Base';

/**
 * The props of `DateInput`. The value is a date as `"yyyy-MM-dd"`, for
 * example `"2026-11-17"`, or `null`.
 */
export type DateInputProps = DateInputCommonProps;

export type { DateInputVariant, SelectableDays } from './DateTimeInput/Base';

/**
 * An input for a date, with a calendar. The user types the date in the
 * format of their settings, or picks the day in the calendar.
 */
export default function DateInput(props: DateInputProps) {
  return <DateTimeInputBase {...props} withTime={false} />;
}
