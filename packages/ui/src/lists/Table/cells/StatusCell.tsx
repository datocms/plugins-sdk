import React from 'react';
import FeedbackDot, {
  type FeedbackDotProps,
} from '../../../content/FeedbackDot';

export type StatusCellProps = {
  /** The color of the dot */
  tone: FeedbackDotProps['tone'];
  /** The label after the dot */
  children: React.ReactNode;
};

/** A status: a FeedbackDot and a label */
function StatusCell({ tone, children }: StatusCellProps) {
  return (
    <span className="StatusCell">
      <FeedbackDot tone={tone} />
      {children}
    </span>
  );
}

export default React.memo(StatusCell);
