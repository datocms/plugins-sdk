import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type ProgressBarProps = {
  /**
   * The completed part, from 0 to 1, for example 0.4 for 40%. The component
   * keeps it in this range. Without a value, a short segment moves along the
   * bar without end: the share is not known yet.
   */
  value?: number;
  /**
   * The accessible name of the bar: the task that is in progress, for
   * example "Upload of cover.jpg"
   */
  ariaLabel: TextMessage;
  /**
   * "inline" is a 4px bar as wide as its parent. "edge" is a 2px bar on the
   * bottom edge of the nearest positioned parent, thus it does not cover the
   * content: use it on a card or a row.
   * @default "inline"
   */
  placement?: 'inline' | 'edge';
  /**
   * Only for the place of the bar (width, margin), not for its look. The bar
   * is as wide as its parent: the caller knows the width that fits its
   * layout, for example a maximum width in a table column.
   */
  className?: string;
};

/**
 * A bar that shows how much of a task is done. For a task with no known end,
 * use a Spinner.
 */
function ProgressBar({
  value,
  ariaLabel,
  placement = 'inline',
  className,
}: ProgressBarProps) {
  const { tm } = useTranslation();
  const fraction =
    value === undefined ? undefined : Math.min(1, Math.max(0, value));

  return (
    <div
      className={classNames(
        'ProgressBar',
        `ProgressBar--${placement}`,
        fraction === undefined && 'is-indeterminate',
        className,
      )}
      role="progressbar"
      aria-label={tm(ariaLabel)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={
        fraction === undefined ? undefined : Math.round(fraction * 100)
      }
    >
      <div
        className="ProgressBar__fill"
        style={
          fraction === undefined ? undefined : { width: `${fraction * 100}%` }
        }
      />
    </div>
  );
}

export default React.memo(ProgressBar);
