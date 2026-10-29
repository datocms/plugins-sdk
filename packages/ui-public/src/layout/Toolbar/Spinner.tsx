import React from 'react';
import Spinner from '../../feedback/Spinner';

export type ToolbarSpinnerProps = {
  /** The spinner shows */
  show: boolean;
};

/** A spinner after the title, while the content loads or saves */
function ToolbarSpinner({ show }: ToolbarSpinnerProps) {
  return show ? <Spinner inline={true} className="Toolbar__spinner" /> : null;
}

export default ToolbarSpinner;
