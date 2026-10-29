import React from 'react';
import { useDateSettings } from '../../../content/DateSettings';
import SmartDate from '../../../content/SmartDate';
import { formatFullDateTime } from '../../../utils/formatDate';

export type TimeCellProps = {
  /** The date, as an ISO 8601 string */
  value: string;
};

/** A date as a relative time. The title shows the full date and time. */
function TimeCell({ value }: TimeCellProps) {
  const settings = useDateSettings();

  return (
    <span className="TimeCell" title={formatFullDateTime(value, settings)}>
      <SmartDate value={value} />
    </span>
  );
}

export default React.memo(TimeCell);
