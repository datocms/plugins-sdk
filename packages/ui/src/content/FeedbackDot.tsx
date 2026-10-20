import classNames from 'classnames';
import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type FeedbackDotProps = {
  /**
   * The state that the dot shows. "success" is green, "warning" is amber,
   * "danger" is red and "neutral" is grey.
   */
  tone: 'success' | 'warning' | 'danger' | 'neutral';
  /**
   * The state in words, for the screen readers. Give it when the dot is the
   * only sign of the state (no text near it says the state). Without it, the
   * screen readers do not read the dot.
   */
  ariaLabel?: TextMessage;
};

/** A small colored dot that shows the state of an item, before its label. */
function FeedbackDot({ tone, ariaLabel }: FeedbackDotProps) {
  const { tm } = useTranslation();

  return (
    <svg
      viewBox="0 0 100 100"
      {...(ariaLabel !== undefined
        ? { role: 'img', 'aria-label': tm(ariaLabel) }
        : { 'aria-hidden': true })}
      className={classNames('FeedbackDot', `FeedbackDot--${tone}`)}
    >
      <circle cx="50" cy="50" r="45" />
    </svg>
  );
}

export default React.memo(FeedbackDot);
