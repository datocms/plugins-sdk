import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import { type TextsAdapter } from '../TextsProvider';

export type UsageMeterProps = {
  /** The current usage, in the same unit as `limit`, for example 820 */
  usage: number;
  /** The included amount, in the same unit as `usage`, for example 1000 */
  limit: number;
  /**
   * The accessible name of the meter. Without it, the meter has no role:
   * give the name to the element around it (for example, the target of a
   * tooltip). usageMeterLabel gives a name.
   */
  ariaLabel?: TextMessage;
  /**
   * Tells that the usage over the limit is stopped (a free plan): the part
   * over the limit is red. Without it, the owner pays for the usage over the
   * limit, and this part is amber.
   * @default false
   */
  blocked?: boolean;
  /** Only for the size and the place of the meter, not for its look */
  className?: string;
};

/** The usage against a limit, with the part over the limit in color */
export function UsageMeter({
  usage,
  limit,
  ariaLabel,
  blocked,
  className,
}: UsageMeterProps) {
  const { tm } = useTranslation();
  const labelText = ariaLabel ? tm(ariaLabel) : undefined;
  const total = Math.max(usage, limit);
  const within = total > 0 ? (Math.min(usage, limit) / total) * 100 : 0;
  const over = total > 0 ? ((usage - limit) / total) * 100 : 0;

  return (
    <div
      className={classNames(
        'UsageMeter',
        { 'UsageMeter--blocked': blocked },
        className,
      )}
      role={labelText ? 'img' : undefined}
      aria-label={labelText}
    >
      <span className="UsageMeter__within" style={{ width: `${within}%` }} />
      {over > 0 && (
        <span className="UsageMeter__over" style={{ width: `${over}%` }} />
      )}
    </div>
  );
}

/**
 * The usage against a limit as a ring, for a row with no space for a bar.
 * The ring starts at the top and goes clockwise, and a full ring is the
 * limit. Over the limit, the full ring is in color. Like an icon, it has the
 * size of the text around it (1em).
 */
export function UsageRing({
  usage,
  limit,
  ariaLabel,
  blocked,
  className,
}: UsageMeterProps) {
  const { tm } = useTranslation();
  const labelText = ariaLabel ? tm(ariaLabel) : undefined;
  const over = usage > limit;
  const within = limit > 0 ? (Math.min(usage, limit) / limit) * 100 : 0;

  return (
    <svg
      className={classNames(
        'UsageRing',
        { 'UsageRing--over': over, 'UsageRing--blocked': blocked },
        className,
      )}
      viewBox="0 0 20 20"
      role={labelText ? 'img' : undefined}
      aria-label={labelText}
      aria-hidden={labelText ? undefined : true}
    >
      <circle className="UsageRing__track" cx="10" cy="10" r="8" />
      {within > 0 && (
        <circle
          className="UsageRing__fill"
          cx="10"
          cy="10"
          r="8"
          pathLength={100}
          strokeDasharray={`${within} 100`}
        />
      )}
    </svg>
  );
}

/** The text of a meter for screen readers: "80% of the limit" */
export function usageMeterLabel(
  t: TextsAdapter['t'],
  usage: number,
  limit: number,
) {
  return t('usage.meterLabel', {
    percent: limit > 0 ? Math.round((usage / limit) * 100) : 0,
  });
}
