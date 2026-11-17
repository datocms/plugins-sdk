import React from 'react';
import DateTimeInputBase, { type DateTimeInputProps } from './Base';

export type {
  DateInputCommonProps,
  DateInputVariant,
  DateTimeInputProps,
  SelectableDays,
} from './Base';

/**
 * An input for a date and a time, with a calendar and a time zone menu. The
 * user types the date and the time in the format of their settings, in
 * their time zone, or picks the day in the calendar. The value has the
 * offset of the time zone of the project.
 */
export default function DateTimeInput(props: DateTimeInputProps) {
  return <DateTimeInputBase {...props} withTime />;
}
